using Celular.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Celular.Controllers
{
    public class SeleccionPortafolioController : Controller
    {
        // GET: Asignar
        public ActionResult Index()
        {
            if (Session["usuario"] != null)
            {
                Inicio entidad = new Inicio();
                entidad.usuario = int.Parse(Session["usuario"].ToString());
                entidad.nombreusuario = Session["nombreusuario"].ToString();

                return View(entidad);
            }
            else
            {
                return Redirect("./Login");
            }
        }
        public ActionResult IrAPropuesta(int prm)
        {
            Session["portafolio"] = prm;
            return Redirect("/PropuestaBalanceo");
        }
    }
}