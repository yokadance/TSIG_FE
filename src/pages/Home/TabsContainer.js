import React, { useState } from "react";
import { Tabs } from "antd";
import MapShapeToWkt from "../MapShapeToWkt/MapShapeToWkt";
import WktToMap from "../WktToMap/WktToMap";
import AddInterestZone from "../AddInterestZone/AddInterestZone"
const { TabPane } = Tabs;

export default function TabsContainer({ map }) {
  return (
    <div className="tabs-container">
      <Tabs
        defaultActiveKey="1"
        type="card"
        size="large"
        destroyInactiveTabPane={true}
      >
        {/*         <TabPane tab="WKT to Map" key="1">
          <WktToMap map={map} />
        </TabPane>
        <TabPane tab="Map Shape to Wkt" key="2">
          <MapShapeToWkt map={map} />
        </TabPane> */}
        <TabPane tab="Zona de interes" key="3">
          <AddInterestZone map={map} />
        </TabPane>
      </Tabs>
    </div>
  );
}
