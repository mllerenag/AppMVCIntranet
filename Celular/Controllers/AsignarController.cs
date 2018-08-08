using Celular.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Celular.Controllers
{
    public class AsignarController : Controller
    {
        // GET: Asignar
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult AgregarEditar(int id, int accion)
        {
            Asignar entidad = new Asignar();
            entidad.idCodAsignacion = id;
            entidad.accion = accion;
            return View(entidad);
        }

        [HttpPost]
        public ActionResult SubirArchivo()
        {
            List<String> archivos = new List<String>();

            if (Request.Files.Count > 0)
            {
                try
                {
                    //  Get all files from Request object  
                    HttpFileCollectionBase files = Request.Files;
                    for (int i = 0; i < files.Count; i++)
                    {
                        //string path = AppDomain.CurrentDomain.BaseDirectory + "Uploads/";  
                        //string filename = Path.GetFileName(Request.Files[i].FileName);  

                        HttpPostedFileBase file = files[i];
                        string fname;

                        // Checking for Internet Explorer  
                        if (Request.Browser.Browser.ToUpper() == "IE" || Request.Browser.Browser.ToUpper() == "INTERNETEXPLORER")
                        {
                            string[] testfiles = file.FileName.Split(new char[] { '\\' });
                            fname = testfiles[testfiles.Length - 1];
                        }
                        else
                        {
                            fname = file.FileName;
                        }

                        // Get the complete folder path and store the file inside it.
                        string ext = System.IO.Path.GetExtension(fname).ToLower();

                        if (ext == ".jpg" || ext == ".png" || ext == ".gif" || ext == ".jpeg" || ext == ".bmp" || ext == ".mp3" || ext == ".mp4" || ext == ".avi" || ext == ".mov" || ext == ".xlsx" || ext == ".pdf")
                        {
                            String identificador = "";
                            String archivo = "";
                            archivo = fname;
                            identificador = Guid.NewGuid().ToString();
                            fname = Path.Combine(Server.MapPath("~/Adjuntos/"), identificador + "_" + fname);
                            file.SaveAs(fname);
                            archivos.Add(identificador + "_" + archivo);
                        }


                    }
                    // Returns message that successfully uploaded  
                    return Json(archivos, JsonRequestBehavior.AllowGet);
                }
                catch (Exception ex)
                {
                    return Json("Error occurred. Error details: " + ex.Message);
                }
            }
            else
            {
                return Json("No files selected.");
            }
        }

    }
}