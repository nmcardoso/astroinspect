/* eslint-disable @next/next/no-img-element */
import type { NextPage } from 'next'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import AppNavbar from '../components/common/AppNavbar'
import { getBaseURL } from '../lib/utils'
import Link from 'next/link'


const MyCard = ({ title, children, url }: any) => {
  return (
    <Card title="Cosias">
      <Row>
        <Col md={4}>
          <Card.Img
            variant="top"
            src={`${getBaseURL()}${url}`}
            className="img-fluid rounded-start" />
        </Col>
        <Col md={8}>
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
          <Col md={8} className="mx-auto">
            <MyCard title="XTable" url="xtable_screenshot.png">
              <Card.Text>
                Tool designed to quickly merge an input table with data{' '}
                (catalog and images) obtained from web services provided by{' '}
                <a href="https://splus.cloud">S-PLUS</a>,{' '}
                <a href="https://legacysurvey.org">Legacy Survey</a> and{' '}
                <a href="https://sdss.org">SDSS</a>.
              </Card.Text>
              {/* <Button
                variant="primary"
                href={`${getBaseURL()}xtable`}>
                Access
              </Button> */}
              <Link href="/xtable">
                Access
              </Link>
            </MyCard>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default Home
