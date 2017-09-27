using Microsoft.AspNet.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BuscandoMeuFilhoApp
{
    public class ControlHub : Hub
    {
        private static IList<Parent> _parentsOnWay = new List<Parent>();
        private static string _schoolConnectionId;
       
        public void RegisterSchoolConnection() 
        {
            _schoolConnectionId = Context.ConnectionId;
        }

        public void GetParentsOnWay()
        {
            Clients.Client(_schoolConnectionId).getParentsOnWayCallback(_parentsOnWay);
        }

        public void SetParentOnWay(string parentName, string distance, string studentsName)
        {
            var parentOnWay = new Parent();
            parentOnWay.Name = parentName;
            parentOnWay.Distance = distance;
            parentOnWay.StudentName = studentsName;

            //Removing before shit happen.
            var parent = _parentsOnWay.FirstOrDefault(a => a.Name == parentName);
            _parentsOnWay.Remove(parent);

            _parentsOnWay.Add(parentOnWay);
            Clients.Client(_schoolConnectionId).getParentsOnWayCallback(_parentsOnWay);
        }

        public void RemoveParentOnWay(string parentName)
        {
            var parent = _parentsOnWay.FirstOrDefault(a => a.Name == parentName);
            _parentsOnWay.Remove(parent);
            Clients.Client(_schoolConnectionId).getParentsOnWayCallback(_parentsOnWay);
        }
    }
}