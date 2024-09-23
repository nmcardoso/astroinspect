import logging
import math
import os
import urllib.parse
from datetime import datetime, timedelta
from io import BytesIO

from flask import Flask, request, send_file
from flask_cors import CORS, cross_origin
from matplotlib.figure import Figure
from requests import Session

if os.getenv('ENV') != 'PRODUCTION':
  from dotenv import load_dotenv
  load_dotenv(dotenv_path='variables.env')

# routes = web.RouteTableDef()
# session = aiohttp.ClientSession()
session = Session()
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

_TOKEN = {'value': None, 'date': None}


def get_token():
  if _TOKEN['value'] is not None:
    date_now = datetime.now()
    date_delta = timedelta(minutes=60)
    if _TOKEN['date'] > date_now - date_delta:
      print('>>> Cached Auth')
      return _TOKEN['value']

  print('>>> Auth Request')
  credentials = {
    'username': os.getenv('SPLUS_USERNAME'),
    'password': os.getenv('SPLUS_PASSWORD')
  }

  resp = session.post('https://splus.cloud/api/auth/login', json=credentials)
  if resp.status_code == 200:
    data = resp.json()
    if 'token' in data:
      token = data['token']
      _TOKEN['value'] = token
      _TOKEN['date'] = datetime.now()
      return token
  return None


@app.get('/')
def hello():
  return 'Hello, world'


@app.get('/plot')
@cross_origin()
def plot():
  token = get_token()
  if token is None:
    return 'Auth failed.'

  obj_id = request.args.get('id', None)
  ra = request.args.get('ra')
  dec = request.args.get('dec')

  use_iso = request.args.get('iso') in ['1', '']
  use_aper3 = request.args.get('aper3') in ['1', '']
  use_aper6 = request.args.get('aper6') in ['1', '']
  use_auto = request.args.get('auto') in ['1', '']
  use_petro = request.args.get('petro') in ['1', '']
  use_pstotal = request.args.get('pstotal') in ['1', '']
  use_id = obj_id is not None

  if request.args.get('all') in ['1', '']:
    use_iso, use_aper3, use_aper6, use_auto, use_petro, use_pstotal = (
      True, ) * 6
  elif (not use_iso and not use_aper3 and not use_aper6 and not use_auto
        and not use_petro and not use_pstotal):
    use_iso, use_aper6 = True, True

  bands = [
    'u', 'j0378', 'j0395', 'j0410', 'j0430', 'g', 'j0515', 'r', 'j0660', 'i',
    'j0861', 'z'
  ]
  x = [3485, 3785, 3950, 4100, 4300, 4803, 5150, 6250, 6600, 7660, 8610, 9110]
  alias = [
    'U', 'J0378', 'J0395', 'J0410', 'J0430', 'G', 'J0515', 'R', 'J0660', 'I',
    'J0861', 'Z'
  ]

  iso_bands = [f'{b}_iso' for b in bands]
  iso_err_bands = [f'e_{b}_iso' for b in bands]
  aper3_bands = [f'{b}_aper_3' for b in bands]
  aper3_err_bands = [f'e_{b}_aper_3' for b in bands]
  aper6_bands = [f'{b}_aper_6' for b in bands]
  aper6_err_bands = [f'e_{b}_aper_6' for b in bands]
  auto_bands = [f'{b}_auto' for b in bands]
  auto_err_bands = [f'e_{b}_auto' for b in bands]
  petro_bands = [f'{b}_petro' for b in bands]
  petro_err_bands = [f'e_{b}_petro' for b in bands]
  pstotal_bands = [f'{b}_PStotal' for b in bands]
  pstotal_err_bands = [f'e_{b}_PStotal' for b in bands]

  all_names = []
  if use_iso:
    all_names.append('iso')
  if use_aper3:
    all_names.append('aper_3')
  if use_aper6:
    all_names.append('aper_6')
  if use_auto:
    all_names.append('auto')
  if use_petro:
    all_names.append('petro')
  if use_pstotal:
    all_names.append('PStotal')

  get_columns = lambda band, apper: ', '.join([f'p.{band}_{a}' for a in apper])
  get_columns_error = lambda band, apper: ', '.join([f'p.e_{band}_{a}' for a in apper])

  query = f'''SELECT top 1 p.id, p.ra, p.dec,
    DISTANCE(POINT('ICRS', {ra}, {dec}),POINT('ICRS', p.ra, p.dec)) AS dist,
    {get_columns('g', all_names)},
    {get_columns_error('g', all_names)},
    {get_columns('z', all_names)},
    {get_columns_error('z', all_names)},
    {get_columns('r', all_names)},
    {get_columns_error('r', all_names)},
    {get_columns('i', all_names)},
    {get_columns_error('i', all_names)},
    {get_columns('u', all_names)},
    {get_columns_error('u', all_names)},
    {get_columns('j0378', all_names)},
    {get_columns_error('j0378', all_names)},
    {get_columns('j0395', all_names)},
    {get_columns_error('j0395', all_names)},
    {get_columns('j0410', all_names)},
    {get_columns_error('j0410', all_names)},
    {get_columns('j0430', all_names)},
    {get_columns_error('j0430', all_names)},
    {get_columns('j0515', all_names)},
    {get_columns_error('j0515', all_names)},
    {get_columns('j0660', all_names)},
    {get_columns_error('j0660', all_names)},
    {get_columns('j0861', all_names)},
    {get_columns_error('j0861', all_names)}
  FROM idr5.idr5_dual AS p
  WHERE 1 = CONTAINS(POINT('ICRS', p.ra, p.dec), 
    CIRCLE('ICRS', {ra}, {dec}, 0.0015))
  ORDER BY dist ASC'''

  query_url = ('https://splus.cloud/tap/tap/sync/?request=doQuery&version=1.0'
               '&lang=ADQL&phase=run&format=application/json&query=' +
               urllib.parse.quote(query))

  headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': f'Token {token}'
  }

  query_start_time = datetime.now()
  resp = session.post(query_url, headers=headers)
  print('>>> Query duration:', str(datetime.now() - query_start_time))
  if resp.status_code != 200 or 'application/json' not in resp.headers['Content-Type']:
    return 'Query Error'

  data = resp.json()

  if len(data['data']) < 1:
    return 'ID not found'

  data_map = {}
  for i in range(len(data['metadata'])):
    data_map[data['metadata'][i]['name'].lower()] = data['data'][0][i]

  plot_params = {
    'fmt': '-',
    'capsize': 4,
    'alpha': 0.95,
    'linewidth': 1,
    'markersize': 3,
    'marker': 'o'
  }

  mask = lambda v: math.nan if v < 9 or v > 25 else v
  error_mask = lambda v: math.nan if v > 2 else v
  nan_filter = lambda x, y: zip(*filter(lambda _x: not math.isnan(_x[1]),
                                        zip(x, y)))
  y_min, y_max = 999999, -999999

  plot_start_time = datetime.now()
  fig = Figure(figsize=(10, 7))
  ax = fig.subplots()
  if use_iso:
    iso_y = [data_map[b] for b in iso_bands]
    iso_y_err = [data_map[b] for b in iso_err_bands]
    iso_y = list(map(mask, iso_y))
    iso_y_err = list(map(error_mask, iso_y_err))
    filtered_iso_x, filtered_iso_y = nan_filter(x, iso_y)
    y_min = min(y_min, *filtered_iso_y)
    y_max = max(y_max, *filtered_iso_y)
    ax.plot(filtered_iso_x,
            filtered_iso_y,
            '--',
            color='tab:blue',
            alpha=0.75,
            linewidth=0.8)
    ax.errorbar(x,
                iso_y,
                yerr=iso_y_err,
                label='ISO',
                color='tab:blue',
                **plot_params)
  if use_aper3:
    aper3_y = [data_map[b] for b in aper3_bands]
    aper3_y_err = [data_map[b] for b in aper3_err_bands]
    aper3_y = list(map(mask, aper3_y))
    aper3_y_err = list(map(error_mask, aper3_y_err))
    filtered_aper3_x, filtered_aper3_y = nan_filter(x, aper3_y)
    y_min = min(y_min, *filtered_aper3_y)
    y_max = max(y_max, *filtered_aper3_y)
    ax.plot(filtered_aper3_x,
            filtered_aper3_y,
            '--',
            color='tab:green',
            alpha=0.75,
            linewidth=0.8)
    ax.errorbar(x,
                aper3_y,
                yerr=aper3_y_err,
                label='APER 3',
                color='tab:green',
                **plot_params)
  if use_aper6:
    aper6_y = [data_map[b] for b in aper6_bands]
    aper6_y_err = [data_map[b] for b in aper6_err_bands]
    aper6_y = list(map(mask, aper6_y))
    aper6_y_err = list(map(error_mask, aper6_y_err))
    filtered_aper6_x, filtered_aper6_y = nan_filter(x, aper6_y)
    y_min = min(y_min, *filtered_aper6_y)
    y_max = max(y_max, *filtered_aper6_y)
    ax.plot(filtered_aper6_x,
            filtered_aper6_y,
            '--',
            color='tab:red',
            alpha=0.75,
            linewidth=0.8)
    ax.errorbar(x,
                aper6_y,
                yerr=aper6_y_err,
                label='APER 6',
                color='tab:red',
                **plot_params)
  if use_auto:
    auto_y = [data_map[b] for b in auto_bands]
    auto_y_err = [data_map[b] for b in auto_err_bands]
    auto_y = list(map(mask, auto_y))
    auto_y_err = list(map(error_mask, auto_y_err))
    filtered_auto_x, filtered_auto_y = nan_filter(x, auto_y)
    y_min = min(y_min, *filtered_auto_y)
    y_max = max(y_max, *filtered_auto_y)
    ax.plot(filtered_auto_x,
            filtered_auto_y,
            '--',
            color='tab:orange',
            alpha=0.75,
            linewidth=0.8)
    ax.errorbar(x,
                auto_y,
                yerr=auto_y_err,
                label='AUTO',
                color='tab:orange',
                **plot_params)
  if use_petro:
    petro_y = [data_map[b] for b in petro_bands]
    petro_y_err = [data_map[b] for b in petro_err_bands]
    petro_y = list(map(mask, petro_y))
    petro_y_err = list(map(error_mask, petro_y_err))
    filtered_petro_x, filtered_petro_y = nan_filter(x, petro_y)
    y_min = min(y_min, *filtered_petro_y)
    y_max = max(y_max, *filtered_petro_y)
    ax.plot(filtered_petro_x,
            filtered_petro_y,
            '--',
            color='tab:purple',
            alpha=0.75,
            linewidth=0.8)
    ax.errorbar(x,
                petro_y,
                yerr=petro_y_err,
                label='PETRO',
                color='tab:purple',
                **plot_params)
  if use_pstotal:
    pstotal_y = [data_map[b.lower()] for b in pstotal_bands]
    pstotal_y_err = [data_map[b.lower()] for b in pstotal_err_bands]
    pstotal_y = list(map(mask, pstotal_y))
    pstotal_y_err = list(map(error_mask, pstotal_y_err))
    filtered_pstotal_x, filtered_pstotal_y = nan_filter(x, pstotal_y)
    y_min = min(y_min, *filtered_pstotal_y)
    y_max = max(y_max, *filtered_pstotal_y)
    ax.plot(filtered_pstotal_x,
            filtered_pstotal_y,
            '--',
            color='tab:brown',
            alpha=0.75,
            linewidth=0.8)
    ax.errorbar(x,
                pstotal_y,
                yerr=pstotal_y_err,
                label='PSTOTAL',
                color='tab:brown',
                **plot_params)

  ax.set_xlabel('Wavelength [$\\AA$]')
  ax.set_ylabel('Magnitude')
  if use_id:
    ax.set_title(f'S-PLUS PhotoSpec (ID: {obj_id})')
  else:
    ax.set_title(
      f'S-PLUS PhotoSpec (RA: {float(ra):.4f} DEC: {float(dec):.4f})')
  ax.set_ylim(y_min - 0.18, y_max + 0.18)
  ax.minorticks_on()
  ax.tick_params(axis='both', which='both', direction='in', right=True)
  ax.grid(True, which='major', axis='y', alpha=0.6, linestyle=':')
  ax.invert_yaxis()
  ax.legend()

  bands_ax = ax.twiny()
  bands_ax.set_xlim(ax.get_xlim())
  bands_ax.set_xticks(x)
  bands_ax.set_xticklabels(alias,
                           ha='left',
                           va='center',
                           rotation=65,
                           rotation_mode='anchor')
  bands_ax.tick_params(axis='both', direction='in')
  bands_ax.grid(True, which='major', axis='x', alpha=0.6, linestyle=':')

  if os.getenv('ENV') != 'PRODUCTION':
    print('>>> Plot duration:', str(datetime.now() - plot_start_time))
    save_start_time = datetime.now()

  buff = BytesIO()
  fig.savefig(buff, format='jpg', bbox_inches='tight', pad_inches=0.05)
  buff.seek(0)

  if os.getenv('ENV') != 'PRODUCTION':
    print('>>> Save duration:', str(datetime.now() - save_start_time))
  print('>>> Total plot duration:', str(datetime.now() - plot_start_time))

  return send_file(buff, mimetype='image/jpeg', as_attachment=False, download_name='plot')
  # return web.Response(body=buff.read(), headers={'Content-Type': 'image/jpg'})
  # response = web.StreamResponse(headers={'Content-Type': 'image/jpg'})
  # await response.prepare(request)
  # await response.write(buff.read())


@app.errorhandler(Exception)
def handle_exception(e):
  logging.exception(e)



# app = web.Application(middlewares=[cors_middleware(allow_all=True)])
# app.add_routes(routes)
# app = web.Application(router=routes, middlewares=cors_middleware(allow_all=True))



if __name__ == '__main__':
  # web.run_app(app)
  pass

