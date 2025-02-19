"use client";
import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Para redirección
import { useSession } from "next-auth/react";
import { getMenus } from "@/app/utils/api/accesos_menu/accesos_menu";
import { getSubMenus } from "../utils/api/sub_menus/sub_menus";

function Menu({ vertical, toogle }) {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState({});
  const [isOpenSub, setIsOpenSub] = useState({});
  const [menus, setMenus] = useState([]);
  const [subMenus, setSubMenus] = useState([]);
  const [groupedMenus, setGroupedMenus] = useState({});
  const menuRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const detailsRefs = useRef({});

  useEffect(() => {
    if (status === "loading" || !session) return;
    const fetchMenus = async () => {
      const { token } = session.user;
      const [fetchedMenus, subMenus] = await Promise.all([
        getMenus(token, false),
        getSubMenus(token, false),
      ]);
      setMenus(fetchedMenus);
      setSubMenus(subMenus);
      const initialOpenState = fetchedMenus.reduce((acc, menu) => {
        acc[menu.menu] = false;
        return acc;
      }, {});
      setIsOpen(initialOpenState);
    };

    fetchMenus();
  }, [session, status]);

  const toggleMenu = (menu) => {
    setIsOpen((prev) => {
      const newState = { ...prev };
      Object.keys(newState).forEach((key) => {
        newState[key] = false;
      });
      newState[menu] = !prev[menu];
      return newState;
    });
  };

  const toggleMenuSub = (title) => {
    setIsOpenSub((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const closeMenus = () => {
    setIsOpen(
      Object.keys(isOpen).reduce((acc, category) => {
        acc[category] = false;
        return acc;
      }, {})
    );
  };

  const closeMenusSub = () => {
    setIsOpenSub({});
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      closeMenus();
      closeMenusSub();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    let groupedMenus = [];
    let groupedSubMenus = [];
    groupedMenus = menus.reduce((acc, menu) => {
      const { user } = session || {};
      if (!acc[menu.menu]) acc[menu.menu] = [];
      if (!user.es_admin && menu.menu === "Utilerías") {
        if (menu.descripcion === "Usuarios") {
          acc[menu.menu].push(menu);
        }
      } else {
        groupedSubMenus = subMenus.reduce((acc, subMenu) => {
          const descripcion = subMenu.descripcion;
          const rutaMenu = menus.find((m) => m.numero === subMenu.id_acceso);
          if (!acc[descripcion]) {
            acc[descripcion] = []; // Aquí usamos la descripción como clave
          }
          acc[descripcion].push(rutaMenu); // Aquí agrupamos los submenús bajo esa clave
          return acc;
        }, {});
        acc[menu.menu].push(menu);
      }
      return acc;
    }, {});

    const newObjects = Object.entries(groupedMenus).reduce(
      (acc, [key, value]) => {
        const groupedItems = new Set();
        Object.entries(groupedSubMenus).forEach(([subKey, subMenuArray]) => {
          subMenuArray.forEach((subMenu) => {
            if (subMenu.menu === key) {
              groupedItems.add(subMenu.numero);
            }
          });
        });
        const filteredItems = value.filter(
          (item) => !groupedItems.has(item.numero)
        );

        acc[key] = acc[key] || [];
        Object.entries(groupedSubMenus).forEach(([subKey, subMenuArray]) => {
          const matchingSubMenus = subMenuArray.filter(
            (subMenu) => subMenu.menu === key
          );
          if (matchingSubMenus.length > 0) {
            acc[key].push({ [subKey]: matchingSubMenus });
          }
        });
        acc[key].push(...filteredItems);
        return acc;
      },
      {}
    );

    setGroupedMenus(newObjects);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menus, session]);

  const sortedCategories = Object.keys(groupedMenus).sort();

  const renderMenuItems = (category) => {
    const { permissions } = session.user;
    const { user } = session;
    return (groupedMenus[category] || []).map((menuItem) => {
      const is_admin = user.es_admin;
      const hasPermission =
        is_admin ||
        permissions.some(
          (perm) => perm.id_punto_menu === menuItem.numero && perm.t_a
        );
      const linkTo = hasPermission
        ? menuItem.ruta || "#"
        : `/acceso_denegado?menu=true`;
      const subMenus = Object.keys(menuItem).reduce((acc, key) => {
        if (Array.isArray(menuItem[key])) {
          acc.push({ title: key, items: menuItem[key] });
        }
        return acc;
      }, []);
      return (
        <>
          {menuItem.numero != undefined && (
            <li key={menuItem.numero} className="position">
              <Link
                href={linkTo}
                onClick={() => {
                  closeMenus();
                  if (isMobile) {
                    toogle();
                  }
                  localStorage.setItem("puntoMenu", menuItem.numero);
                }}
              >
                {menuItem.descripcion}
              </Link>
            </li>
          )}
          {subMenus.length > 0 &&
            subMenus.map((subMenu, idx) => (
              <li key={idx} className="position">
                <details
                  ref={(el) => (detailsRefs.current[subMenu.title] = el)}
                  open={!!isOpenSub[subMenu.title]}
                >
                  <summary
                    onClick={(e) => {
                      e.preventDefault();
                      toggleMenuSub(subMenu.title);
                    }}
                  >
                    {subMenu.title}
                  </summary>
                  <ul className="text-black dark:text-white">
                    {subMenu.items.map((subItem, subIdx) => {
                      const subLinkTo = subItem.ruta || "#";
                      return (
                        <li key={subIdx}>
                          <Link
                            href={subLinkTo}
                            onClick={(e) => {
                              if (subLinkTo === "#") {
                                e.preventDefault();
                              }
                              setIsOpenSub((prev) => ({
                                ...prev,
                                [subMenu.title]: false,
                              }));
                              if (detailsRefs.current[subMenu.title]) {
                                detailsRefs.current[subMenu.title].open = false;
                              }
                              if (isMobile) {
                                toogle();
                              }
                              localStorage.setItem("puntoMenu", subItem.numero);
                            }}
                          >
                            {subItem.descripcion}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </details>
              </li>
            ))}
        </>
      );
    });
  };

  return vertical ? (
    <ul
      ref={menuRef}
      className="menu menu-md dropdown-content bg-base-100 rounded-box text-black dark:text-white mt-3 w-52 p-2 shadow z-50"
    >
      {sortedCategories.map((category, index) => (
        <li key={category + index}>
          <details open={isOpen[category]} onClick={() => toggleMenu(category)}>
            <summary>{category}</summary>
            <ul key={category}>{renderMenuItems(category)}</ul>
          </details>
        </li>
      ))}
    </ul>
  ) : (
    <div className="menu menu-horizontal px-1 z-[2] text-black dark:text-white w-[500px]">
      {sortedCategories.map((category) => (
        <div key={category} className="dropdown">
          <div
            tabIndex={0}
            role="button"
            className="btn m-1 bg-base-200 dark:bg-slate-700 border-none text-black dark:text-white shadow-none"
            onClick={() => toggleMenu(category)}
          >
            {category}
          </div>
          <ul
            className={`dropdown-content menu bg-base-100 rounded-box z-[1] p-2 mt-3 w-52 shadow ${
              isOpen[category] ? "" : "hidden"
            }`}
          >
            {renderMenuItems(category)}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default Menu;
