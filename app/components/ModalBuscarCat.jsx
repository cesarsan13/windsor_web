import React from 'react';
import NoData from "@/app/components/noData";

function ModalBuscarCat({ data, fieldsToShow, setItem }) {
    const ModalAction = (item) => {
        setItem(item);
        document.getElementById("my_modal_4").close();
    };

    return (
        <dialog id='my_modal_4' className='modal'>
            <div className='modal-box'>
                <button
                    className='btn btn-sm btn-circle btn-ghost text-black dark:text-white absolute right-2 top-2'
                    onClick={() => document.getElementById("my_modal_4").close()}
                >
                    ✕
                </button>
                <div className='text-black bg-white dark:bg-[#1d232a] dark:text-white mt-4 w-full'>
                    {data.length > 0 ? (
                        <table className='table table-xs table-zebra table-pin-rows table-pin-cols max-h-[calc(50%)]'>
                            <thead className='relative z-[1] md:static'>
                                <tr>
                                    <th></th>
                                    {fieldsToShow.map((field, index) => (
                                        <th key={index}>{field}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((item, index) => (
                                    <tr key={index}>
                                        <th>
                                            <div className='flex flex-row space-x-3'>
                                                <div
                                                    className="kbd tooltip tooltip-right hover:cursor-pointer bg-blue-500 hover:bg-blue-700 text-white"
                                                    data-tip={`Seleccionar ${item[fieldsToShow[0]]}`} // Usar el primer campo de fieldsToShow
                                                    onClick={(evt) => ModalAction(item)}
                                                >
                                                    <i className="fa-solid fa-eye"></i>
                                                </div>
                                            </div>
                                        </th>
                                        {fieldsToShow.map((field, subIndex) => (
                                            <td key={subIndex}>{item[field]}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <NoData />
                    )}
                </div>
            </div>
        </dialog>
    );
}

export default ModalBuscarCat;
