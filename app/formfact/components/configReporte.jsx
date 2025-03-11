import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Sheet from "@/app/formfact/components/sheet";
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
  const [arreglo, setArreglo] = useState({})
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
  useEffect(() => {
    const arreglo = labels
      .filter((l) => l.visible === 1)
      .map((label) => (
        { id: label.numero_dato - 1, descripcion: `Texto_${label.numero_dato}` }))
    setArreglo(arreglo)
  }, [labels])
  const handleCancelarClick = (evt) => {
    evt.preventDefault();
    setShowSheet(false);
    setSelectedIndex(null);
    setLabels([]);
  };
  return (
    <div className=" w-full max-w-full">
      <button
        className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        onClick={() => document.getElementById("modal_formato").close()}
      >
        ✕
      </button>
      <>
        <h1 className="font-bold text-2xl mb-5 text-black dark:text-white">Actualizacion de formato</h1>
        <div
            className={`tooltip tooltip-top "hover:cursor-pointer"
              `}
            data-tip="cancelar"
          >
            <button
              type="submit"
              id="btn_cancelar"
              className="btn  bg-red-500 hover:bg-red-700 text-white"
              onClick={(evt) => handleCancelarClick(evt)}
            >
              <i className="fas fa-x mx-2"></i> Cerrar
            </button>
          </div>
        <fieldset id="fs_formapago" className="flex flex-row justify-center">
          <div className=" overflow-y-scroll overflow-x-hidden gap-2 h-[100%] flex flex-row">
            <Sheet
              labels={labels}
              setLabels={setLabels}
              selectedIndex={selectedIndex}
              setSelectedIndex={setSelectedIndex}
              changeSelectedLabel={changeSelectedLabel}
              setTextoAnterior={setTextoAnterior}
              currentID={currentID}
            ></Sheet>
            {selectedIndex != null && (
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
                  arreglo={arreglo}
                ></PropertyPage>
              </div>
            )}
          </div>

        </fieldset>
      </>
    </div>
  );
}

export default ConfigReporte;
