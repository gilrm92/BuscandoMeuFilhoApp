using Microsoft.AspNet.SignalR;
using Microsoft.Owin.Cors;
using Owin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BuscandoMeuFilhoApp
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            app.UseCors(CorsOptions.AllowAll);
            // Any connection or hub wire up and configuration should go here
            app.MapSignalR("/signalRServer", new HubConfiguration());
        }
    }
}