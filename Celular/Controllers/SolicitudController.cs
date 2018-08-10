using Celular.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Celular.Controllers
{
    public class SolicitudController : Controller
    {
        // GET: Asignar
        public ActionResult Index()
        {
            if (Session["usuario"] != null)
            {
                Inicio entidad = new Inicio();
                return View(entidad);
            }
            else
            {
                return Redirect("./Login");
            }
        }


    }
}