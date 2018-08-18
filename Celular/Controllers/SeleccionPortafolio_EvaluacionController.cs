using Celular.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Celular.Controllers
{
    public class SeleccionPortafolio_EvaluacionController : Controller
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
        public ActionResult IrAEvaluacion(int prm, string nom)
        {
            Session["portafolio"] = prm;
            Session["portafolio_name"] = nom;
            return Redirect("/EvaluarPropuesta");
        }
    }
}