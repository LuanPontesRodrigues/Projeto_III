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
import { useAuth } from "../context/AuthContext";

const SidebarContent = ({ onLogout, empresa, user }) => (
  <div className="p-3" style={{ minWidth: "250px" }}>
    {/* Logo e dados */}
    <div className="sidebar-logo text-center mb-4">
      <img
        src="/Logo.png"
        alt="Logo"
        className="img-fluid"
        style={{ maxWidth: "150px", height: "auto" }}
      />
      {empresa?.nome && (
        <div className="mt-2">
          <small className="text-muted d-block">Empresa</small>
          <strong className="text-dark">{empresa.nome}</strong>
          {user?.nome && (
            <small className="text-muted d-block">{user.nome}</small>
          )}
        </div>
      )}
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
          <FaChartBar className="me-2" /> Dashboard
        </NavLink>
      </li>
    </ul>

    {/* Accordion com menus */}
    <Accordion alwaysOpen>
      {/* Listagem */}
      <Accordion.Item eventKey="0">
        <Accordion.Header>
          <FaListAlt className="me-2" /> Listagem
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
                <FaBoxes className="me-2" /> Produto
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/fornecedor"
                className={({ isActive }) =>
                  `text-decoration-none d-block py-1 ${isActive ? "fw-bold text-primary" : "text-dark"}`
                }
              >
                <FaTruck className="me-2" /> Fornecedor
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/clientes"
                className={({ isActive }) =>
                  `text-decoration-none d-block py-1 ${isActive ? "fw-bold text-primary" : "text-dark"}`
                }
              >
                <FaUserFriends className="me-2" /> Cliente
              </NavLink>
            </li>
          </ul>
        </Accordion.Body>
      </Accordion.Item>

      {/* Estoque */}
      <Accordion.Item eventKey="1">
        <Accordion.Header>
          <FaChartBar className="me-2" /> Estoque
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
                <FaPlusSquare className="me-2" /> Entrada
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/vendas"
                className={({ isActive }) =>
                  `text-decoration-none d-block py-1 ${isActive ? "fw-bold text-primary" : "text-dark"}`
                }
              >
                <FaMinusSquare className="me-2" /> Saída
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/produtos-em-rota"
                className={({ isActive }) =>
                  `text-decoration-none d-block py-1 ${isActive ? "fw-bold text-primary" : "text-dark"}`
                }
              >
                <FaRoute className="me-2" /> Produto em rota
              </NavLink>
            </li>
          </ul>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>

    {/* Logout */}
    <div className="mt-4">
      <button className="btn btn-outline-danger w-100" onClick={onLogout}>
        <FaSignOutAlt className="me-2" /> Encerrar Sessão
      </button>
    </div>
  </div>
);

const Sidebar = ({ show, setShow }) => {
  const { logout, empresa, user } = useAuth();

  const handleLogout = () => {
    if (typeof setShow === "function") {
      setShow(false);
    }
    logout();
  };

  return (
    <>
      {/* Sidebar fixa */}
      <div className="d-none d-md-block bg-light border-end vh-100">
        <SidebarContent onLogout={handleLogout} empresa={empresa} user={user} />
      </div>

      {/* Offcanvas mobile */}
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
          <SidebarContent onLogout={handleLogout} empresa={empresa} user={user} />
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Sidebar;
