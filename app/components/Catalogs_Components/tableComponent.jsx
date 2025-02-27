"use client";
import Loading from "@/app/components/loading";
import NoData from "@/app/components/NoData";
import React from "react";
export default function TableComponent({
  data,
  session,
  isLoading,
  tableColumns,
  tableBody,
}) {
  return !isLoading ? (
    <div className="overflow-y-auto mt-3 h-[calc(60vh)] md:h-[calc(70vh)] text-black bg-white dark:bg-[#1d232a] dark:text-white w-full lg:w-full">
      {data && data.length > 0 ? (
        <table className="table table-zebra w-full ">
          {tableColumns(data)}
          {tableBody(data)}
          <tfoot />
        </table>
      ) : data != null && session && data.length === 0 ? (
        <NoData></NoData>
      ) : (
        <Loading></Loading>
      )}
    </div>
  ) : (
    <Loading></Loading>
  );
}