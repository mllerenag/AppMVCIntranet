using Celular.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Celular.Controllers
{
    public class LoginController : Controller
    {
        // GET: Login
        public ActionResult Index()
        {
            Session["usuario"] = null;
            return View();
        }

        public ActionResult IniciarLogin(int usuario, string nombreusuario, int nid_perfil)
        {
            Session["usuario"] = usuario;
            Session["nombreusuario"] = nombreusuario;
            Session["perfil"] = nid_perfil;
            return Redirect("/Inicio");
        }
        
    }
}