import React, { useState } from "react";
import { useSession } from "next-auth/react";
import Sheet from "./sheet";
import PropertyPage from "@/app/formfact/components/PropertyPage";
function ConfigReporte({ labels, setLabels }) {
  const { data: session, status } = useSession();
  const [selectedLabel, setSelectedLabel] = useState(null);
  return (
    // <dialog id="modal_formato" className="modal ">
    <div className=" w-11/12 max-w-5xl">
      <button
        className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        onClick={() => document.getElementById("modal_formato").close()}
      >
        ✕
      </button>
      <form>
        <h1 className="font-bold text-2xl mb-5">Actualizacion de formato</h1>
        <fieldset id="fs_formapago" className="flex flex-row">
          <Sheet
            labels={labels}
            setLabels={setLabels}
            setSelectedLabel={setSelectedLabel}
          ></Sheet>
          {selectedLabel && (
            <div className="pt-5">
              <PropertyPage selectedLabel={selectedLabel}></PropertyPage>
            </div>
          )}
        </fieldset>
      </form>
    </div>
    // </dialog>
  );
}

export default ConfigReporte;
