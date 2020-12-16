import React, { Component } from 'react';

import { Container, Card, Form, Button, Col, Row } from 'react-bootstrap/';

class Login extends Component {
  state = {};
  render() {
    return (
      <>
      <div className="d-flex flex-fill align-items-center overflow-auto">
          <Container style={{ maxWidth: '500px' }}>
            <Card>
              <Form className="m-3">
                <h1 className="text-center">Login</h1>
                <Form.Group>
                  <Form.Label>Username</Form.Label>
                  <Form.Control type="text"></Form.Control>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password"></Form.Control>
                </Form.Group>
                <Container>
                  <Row className="justify-content-center">
                    <Col md="auto">
                      <Button variant="success" type="submit">
                        Login
                      </Button>
                    </Col>
                  </Row>
                </Container>
              </Form>
            </Card>
          </Container>
          </div>
      </>
    );
  }
}

export default Login;
