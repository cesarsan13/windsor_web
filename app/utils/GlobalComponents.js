import Image from "next/image";
export const ActionButton = ({
  tooltip,
  iconDark,
  iconLight,
  onClick,
  permission,
}) => {
  if (!permission) return null;
  return (
    <th>
      <div
        className="kbd pt-1 tooltip tooltip-left hover:cursor-pointer bg-transparent hover:bg-transparent text-black border-none shadow-none dark:text-white w-5 h-5 md:w-[1.80rem] md:h-[1.80rem] content-center"
        data-tip={tooltip}
        onClick={onClick}
      >
        <Image src={iconDark} alt={tooltip} className="block dark:hidden" />
        <Image src={iconLight} alt={tooltip} className="hidden dark:block" />
      </div>
    </th>
  );
};

export const ActionColumn = ({ description, permission }) => {
  if (!permission) return null;
  return (
    <>
      <th className="w-[5%] pt-[.10rem] pb-[.10rem]">{description}</th>
    </>
  );
};
