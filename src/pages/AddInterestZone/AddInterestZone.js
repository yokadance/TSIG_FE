import React, { useState, useEffect } from "react";
import { DigitizeButton, ToggleGroup } from "@terrestris/react-geo";
import { MapUtil, GeometryUtil } from "@terrestris/ol-util";
import "./AddInterestZone.scss";
import { Popover, Form, Input, Butto, Field, Select, Button } from "antd";

import WKT from "ol/format/WKT";
import { fromCircle } from "ol/geom/Polygon";
import { convertToWK } from 'wkt-parser-helper';
import { writeFilter } from 'ol/format/WFS';
import wfs from 'geojson-to-wfs-t-2'
import FormBuilder from 'antd-form-builder'
import { AiOutlineMinus, BsCircle, BiRectangle, BiPolygon, FiEdit } from "react-icons/all";

const { TextArea } = Input;
const priorityValues = [
    { label: 1, value: 1 },
    { label: 2, value: 2 },
    { label: 3, value: 3 },
    { label: 4, value: 4 },
]




export default function MapShapeToWkt({ map }) {
    const [displayValue, setDisplayValue] = useState(null);
    const [insterestZoneName, setInsterestZoneName] = useState(null);
    const [interestZoneDescription, setInterestZoneDescription] = useState(null);
    const [interestZoneYearBuild, setInterestZoneYearBuild] = useState(null);
    const [priorityValue, setPriorityValue] = useState(null);
    const [interestZoneObservation, setInterestZoneObservation] = useState(null);
    //const [interestZonePolygon, setInterestZonePolygon] = useState(null);

    const [form] = Form.useForm();

    useEffect(() => {
        return () => {
            if (map) clearShape();
        };
    }, []);

    const clearShape = () => {
        const shapeLayer = MapUtil.getLayerByName(map, "shapeLayer");
        shapeLayer.getSource().clear();
    };

    const shapeToWkt = (evt) => {
        let feature = evt.feature;
        let geometry;


        const featureType = feature.getGeometry().getType();
        if (featureType === "Circle") {
            geometry = fromCircle(feature.getGeometry());
        } else {
            geometry = feature.getGeometry();


        }

        const format = new WKT();

        const wktRepresenation = format.writeGeometry(geometry, {
            dataProjection: "EPSG:32721",
            featureProjection: "EPSG:32721",
        });

        setDisplayValue(wktRepresenation);
        ///transform wkt to geojson
        const { parseFromWK } = require('wkt-parser-helper');
        const geojson = parseFromWK(wktRepresenation);
        // console.log(geojson);



    };

    const onFinish = (values) => {
        // console.log(values)

    };
    //SAVE INTEREST ZONE
    /* function saveIz() {
        const axios = require('axios').default

        let insterestZoneName_ = ''
        let interestZoneDescription_ = ''
        let interestZoneYearBuild_ = ''
        let priorityValue_ = ''
        let interestZoneObservation_ = ''
        let interesetZonePolygon_ = ''


        const iz = {

            insterestZoneName_: insterestZoneName,
            interestZoneDescription_: interestZoneDescription,
            interestZoneYearBuild_: interestZoneYearBuild,
            priorityValue_: priorityValue,
            interesetZonePolygon_: displayValue,
            interestZoneObservation_: interestZoneObservation,
        }

        const sendPostRequest = async () => {
            try {
                const resp = await axios.post(
                    ' http://localhost:8088/api/interestZone/addInterestZone',
                    iz,
                )
                console.log(resp.data)
            } catch (err) {
                console.error(err)
            }

        }
        sendPostRequest()
    } */

    const saveIz = async () => {
        const body = {
            interestZoneName: insterestZoneName,
            interestZoneDescription: interestZoneDescription,
            interestZoneYearBuild: interestZoneYearBuild,
            priorityValue: priorityValue,
            interestZonePolygon: displayValue,
            interestZoneObservation: interestZoneObservation,
        };
        const settings = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(body),
        };

        const request = await fetch(
            "http://localhost:8088/api/interestZone/addInterestZone",
            settings
        );
        console.log(JSON.stringify(body) + "<---el BODY")
    }



    return (
        <div className="map-to-wkt">
            {Boolean(map) && (
                <ToggleGroup
                    allowDeselect={false}
                    orientation={"horizontal"}
                    className="map-to-wkt-btns"
                >
                    <DigitizeButton
                        name="drawLine"
                        map={map}
                        shape="circle"
                        drawType="LineString"
                        digitizeLayerName="shapeLayer"
                        size="large"
                        onDrawStart={clearShape}
                        onDrawEnd={shapeToWkt}
                    >
                        <Popover content="Linea" placement="top">
                            <AiOutlineMinus />
                        </Popover>
                    </DigitizeButton>

                    <DigitizeButton
                        name="drawPolygon"
                        map={map}
                        drawType="Polygon"
                        digitizeLayerName="shapeLayer"
                        shape="circle"
                        size="large"
                        onDrawStart={clearShape}
                        onDrawEnd={shapeToWkt}
                    >
                        <Popover content="Poligono" placement="top">
                            <BiPolygon />
                        </Popover>
                    </DigitizeButton>

                    <DigitizeButton
                        name="drawRectangle"
                        map={map}
                        drawType="Rectangle"
                        digitizeLayerName="shapeLayer"
                        shape="circle"
                        size="large"
                        onDrawStart={clearShape}
                        onDrawEnd={shapeToWkt}
                    >
                        <Popover content="Rectangulo" placement="top">
                            <BiRectangle />
                        </Popover>
                    </DigitizeButton>

                    <DigitizeButton
                        name="drawCircle"
                        map={map}
                        drawType="Circle"
                        digitizeLayerName="shapeLayer"
                        shape="circle"
                        size="large"
                        onDrawStart={clearShape}
                        onDrawEnd={shapeToWkt}
                    >
                        <Popover content="Circulo" placement="top">
                            <BsCircle />
                        </Popover>
                    </DigitizeButton>



                    <DigitizeButton
                        name="selectAndModify"
                        digitizeLayerName="shapeLayer"
                        map={map}
                        editType="Edit"
                        shape="circle"
                        size="large"
                    //onDrawEnd={shapeToWkt}
                    >
                        <Popover content="Edit Shape" placement="top">
                            <FiEdit />
                        </Popover>
                    </DigitizeButton>
                </ToggleGroup>

            )}

            <Form layout="vertical" form={form} onFinish={onFinish}>
                <Form.Item label="Agregar Zona de interes" >
                    <label>Nombre</label>
                    <Input label="interestZoneName" name="interestZoneName" type="text" onChange={e => setInsterestZoneName(e.target.value)} />
                    <label>Descripcion</label>
                    <Input name="interestZoneDescription" type="text" onChange={e => setInterestZoneDescription(e.target.value)} />
                    <label>Año de construccion</label>
                    <Input name="interestZoneYearBuild" type="number" onChange={e => setInterestZoneYearBuild(e.target.value)} />
                    <label>Valor de prioridad</label>
                    <Input name="priorityValue" type="number" onChange={e => setPriorityValue(e.target.value)} />
                    <label>Observaciones</label>
                    <Input name="interestZoneObservation" type="text" onChange={e => setInterestZoneObservation(e.target.value)} />
                    <label>WKT a enviar</label>
                    <TextArea rows={6} value={displayValue} readOnly />
                    <div><Button htmlType="submit" onClick={saveIz}>GUARDAR</Button> </div>


                </Form.Item>
            </Form>
        </div>
    );
}
