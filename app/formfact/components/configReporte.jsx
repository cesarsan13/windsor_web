import React, { useState } from "react";
import { useSession } from "next-auth/react";
import Sheet from "./sheet";
import PropertyPage from "@/app/formfact/components/PropertyPage";
function ConfigReporte({ labels, setLabels }) {
  const { data: session, status } = useSession();
  const [selectedLabel, setSelectedLabel] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  return (
    // <dialog id="modal_formato" className="modal ">
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
          <Sheet
            labels={labels}
            setLabels={setLabels}
            setSelectedLabel={setSelectedLabel}
            setSelectedIndex={setSelectedIndex}
          ></Sheet>
          {selectedLabel && (
            <div className="pt-5">
              <PropertyPage
                labels={labels}
                setLabels={setLabels}
                selectedLabel={selectedLabel}
                setSelectedLabel={setSelectedLabel}
                selectedIndex={selectedIndex}
              ></PropertyPage>
            </div>
          )}
        </fieldset>
      </>
    </div>
    // </dialog>
  );
}

export default ConfigReporte;
