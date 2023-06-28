import { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import axios from "axios";
import { Row, Col, Button } from "reactstrap";
import "./App.css";

type Values = {
  firstName: String;
  lastName: String;
  email: String;
  coords:
    | {
        state: String;
        city: String;
        latitude: Number;
        longitude: Number;
      }
    | unknown;
};

export const App = () => {
  const [coords, setCoords] = useState<GeolocationCoordinates>();
  const [permission, setPermission] = useState<boolean>(true);

  useEffect(() => {
    if ("geolocation" in navigator)
      navigator.geolocation.getCurrentPosition(
        (pos) => setCoords(pos.coords),
        (err) => {
          if (err.code == err.PERMISSION_DENIED) {
            setPermission(false);
          }
        }
      );
    else {
      alert("Seu navegador não tem suporte à geolocalização.");
      setPermission(false);
    }
  }, [setCoords]);

  async function handleSubmit(values: Values) {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?lat=${coords?.latitude}&lon=${coords?.longitude}&format=jsonv2`
    );
    console.log("data:", response.data);
    let { lat, lon } = response.data;
    lat = Number(lat);
    lon = Number(lon);
    const { state, city } = response.data.address;
    values.coords = { state, city, lat, lon };
    alert(JSON.stringify(values, null, 2));
    console.log(JSON.stringify(values, null, 2));
  }

  return permission ? (
    <div>
      <h1>Signup</h1>
      <Formik
        initialValues={{
          firstName: "",
          lastName: "",
          email: "",
          coords: {},
        }}
        onSubmit={handleSubmit}
      >
        <Row>
          <Col>
            <Form>
              <Row>
                <Col>
                  <label htmlFor="firstName">First Name </label>
                  <Field
                    id="firstName"
                    name="firstName"
                    placeholder="John"
                    style={{ marginBottom: "10px" }}
                    required
                  />
                </Col>
              </Row>

              <Row>
                <Col>
                  <label htmlFor="lastName">Last Name </label>
                  <Field
                    id="lastName"
                    name="lastName"
                    placeholder="Doe"
                    style={{ marginBottom: "10px" }}
                    required
                  />
                </Col>
              </Row>

              <Row>
                <Col>
                  <label htmlFor="email">Email </label>
                  <Field
                    id="email"
                    name="email"
                    placeholder="john@acme.com"
                    type="email"
                    style={{ marginBottom: "10px", alignSelf: "stretch" }}
                    required
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <Button type="submit" style={{ marginTop: "10px" }}>
                    Submit
                  </Button>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </Formik>
    </div>
  ) : (
    <>
      <p>Impossivel continuar... é necessário que habilite a geolocalização.</p>
    </>
  );
};

export default App;
