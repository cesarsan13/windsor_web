import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Sheet from "./sheet";
import PropertyPage from "@/app/formfact/components/PropertyPage";
function ConfigReporte({
  labels,
  setLabels,
  propertyData,
  setShowSheet,
  currentID,
}) {
  const { data: session, status } = useSession();
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [textoAnterior, setTextoAnterior] = useState("");
  const changeSelectedLabel = (name) => {
    if (textoAnterior !== "" && textoAnterior !== name) {
      const labelAnterior = document.getElementById(textoAnterior);
      labelAnterior.classList.remove(
        "border-2",
        "border-blue-500",
        "border-dashed",
        "rounded-lg"
      );
    }
  };
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
              changeSelectedLabel={changeSelectedLabel}
              setTextoAnterior={setTextoAnterior}
              currentID={currentID}
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
                setTextoAnterior={setTextoAnterior}
                changeSelectedLabel={changeSelectedLabel}
                textoAnterior={textoAnterior}
              ></PropertyPage>
            </div>
          )}
        </fieldset>
      </>
    </div>
  );
}

export default ConfigReporte;
