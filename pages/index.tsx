/* eslint-disable @next/next/no-img-element */
import type { NextPage } from 'next'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import AppNavbar from '../app/common/AppNavbar'
import { getBaseURL } from '../app/lib/utils'
import Link from 'next/link'


const MyCard = ({ title, children, url }: any) => {
  return (
    <Card title={title}>
      <Row>
        <Col md={5}>
          <Card.Img
            variant="top"
            src={`${getBaseURL()}${url}`}
            className="img-fluid rounded-start" />
        </Col>
        <Col md={7} className="g-0">
          <Card.Body>
            <Card.Title>{title}</Card.Title>
            {children}
          </Card.Body>
        </Col>
      </Row>
    </Card >
  )
}

const Home: NextPage = () => {
  return (
    <>
      <AppNavbar />

      <Container className="mt-5">
        <Row>
          <Col lg={8} className="mx-auto">
            <MyCard title="XTable" url="xtable_screenshot.png">
              <Card.Text className="mb-2">
                Tool designed to quickly merge an input table with data{' '}
                (catalog and images) obtained from web services provided by{' '}
                <a href="https://splus.cloud">S-PLUS</a>,{' '}
                <a href="https://legacysurvey.org">Legacy Survey</a> and{' '}
                <a href="https://sdss.org">SDSS</a>.
              </Card.Text>
              <Link href="/xtable" className="btn btn-primary">
                <Button>
                  Access
                </Button>
              </Link>
            </MyCard>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default Home
