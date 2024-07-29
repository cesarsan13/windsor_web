import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Sheet from "./sheet";
import PropertyPage from "@/app/formfact/components/PropertyPage";
function ConfigReporte({ labels, setLabels, propertyData, setShowSheet }) {
  const { data: session, status } = useSession();
  const [selectedIndex, setSelectedIndex] = useState(null);

  return (
    <div className=" w-11/12 max-w-5xl">
      <button
        className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        onClick={() => document.getElementById("modal_formato").close()}
      >
        ✕
      </button>
      <>
        <h1 className="font-bold text-2xl mb-5">Actualizacion de formato</h1>
        <fieldset id="fs_formapago" className="flex flex-row">
          <div className=" overflow-y-scroll overflow-x-hidden h-[100%]">
            <Sheet
              labels={labels}
              setLabels={setLabels}
              selectedIndex={selectedIndex}
              setSelectedIndex={setSelectedIndex}
            ></Sheet>
          </div>
          {selectedIndex && (
            <div className="pt-5">
              <PropertyPage
                session={session}
                labels={labels}
                setLabels={setLabels}
                selectedIndex={selectedIndex}
                propertyData={propertyData}
                setShowSheet={setShowSheet}
                setSelectedIndex={setSelectedIndex}
              ></PropertyPage>
            </div>
          )}
        </fieldset>
      </>
    </div>
  );
}

export default ConfigReporte;
