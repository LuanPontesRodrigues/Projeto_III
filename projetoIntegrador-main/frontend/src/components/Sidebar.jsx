import { 
  FaListAlt, 
  FaBoxes, 
  FaTruck, 
  FaUserFriends, 
  FaSignOutAlt, 
  FaChartBar, 
  FaPlusSquare, 
  FaMinusSquare,
  FaRoute
} from "react-icons/fa";

import React from "react";
import { NavLink } from "react-router-dom";
import { Offcanvas, Accordion } from "react-bootstrap";

const SidebarContent = () => (
  <div className="p-3" style={{ minWidth: "250px" }}>
    <div className="sidebar-logo text-center mb-4">
      <img 
        src="/Logo.png" 
        alt="Logo" 
        className="img-fluid" 
        style={{ maxWidth: "150px", height: "auto" }} 
      />
    </div>

    {/* Dashboard fixo */}
    <ul className="list-unstyled mb-3">
      <li>
        <NavLink 
          to="/" 
          className={({ isActive }) => 
            `text-decoration-none d-block py-1 ${isActive ? "fw-bold text-primary" : "text-dark"}`
          }
        >
          <FaChartBar className="me-2" />Dashboard
        </NavLink>
      </li>
    </ul>

    <Accordion alwaysOpen>
      {/* Listagem */}
      <Accordion.Item eventKey="0">
        <Accordion.Header>
          <FaListAlt className="me-2" />Listagem
        </Accordion.Header>
        <Accordion.Body>
          <ul className="list-unstyled">
            <li>
              <NavLink 
                to="/produtos" 
                className={({ isActive }) => 
                  `text-decoration-none d-block py-1 ${isActive ? "fw-bold text-primary" : "text-dark"}`
                }
              >
                <FaBoxes className="me-2" />Produto
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/fornecedor" 
                className={({ isActive }) => 
                  `text-decoration-none d-block py-1 ${isActive ? "fw-bold text-primary" : "text-dark"}`
                }
              >
                <FaTruck className="me-2" />Fornecedor
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/clientes" 
                className={({ isActive }) => 
                  `text-decoration-none d-block py-1 ${isActive ? "fw-bold text-primary" : "text-dark"}`
                }
              >
                <FaUserFriends className="me-2" />Cliente
              </NavLink>
            </li>
          </ul>
        </Accordion.Body>
      </Accordion.Item>

      {/* Estoque */}
      <Accordion.Item eventKey="1">
        <Accordion.Header>
          <FaChartBar className="me-2" />Estoque
        </Accordion.Header>
        <Accordion.Body>
          <ul className="list-unstyled">
            <li>
              <NavLink 
                to="/entrada" 
                className={({ isActive }) => 
                  `text-decoration-none d-block py-1 ${isActive ? "fw-bold text-primary" : "text-dark"}`
                }
              >
                <FaPlusSquare className="me-2" />Entrada
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/vendas"
                className={({ isActive }) =>
                  `text-decoration-none d-block py-1 ${isActive ? "fw-bold text-primary" : "text-dark"}`
                }
              >
                <FaMinusSquare className="me-2" />Saída
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/produtos-em-rota"
                className={({ isActive }) =>
                  `text-decoration-none d-block py-1 ${isActive ? "fw-bold text-primary" : "text-dark"}`
                }
              >
                <FaRoute className="me-2" />Produto em rota
              </NavLink>
            </li>
          </ul>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>

    {/* Logout */}
    <div className="mt-4">
      <button className="btn btn-outline-danger w-100">
        <FaSignOutAlt className="me-2" />Encerrar Sessão
      </button>
    </div>
  </div>
);

const Sidebar = ({ show, setShow }) => {
  return (
    <>
      {/* Sidebar fixa no desktop */}
      <div className="d-none d-md-block bg-light border-end vh-100">
        <SidebarContent />
      </div>

      {/* Offcanvas no mobile */}
      <Offcanvas
        show={show}
        onHide={() => setShow(false)}
        responsive="md"
        className="d-md-none"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <SidebarContent />
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Sidebar;
