using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Press3.UserDefinedClasses
{
    public class Agent
    {
        public int Id { get; set; }
        public int AccountId { get; set; }
        public string Name { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Mobile { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public int AccountStatusId { get; set; }
        public bool IsEmailVerified { get; set; }
        public bool IsMobileVerified { get; set; }
        public int RoleId { get; set; }
        public int CountryId { get; set; }
        public int TimeZoneId { get; set; }
        public int PhoneType { get; set; }
        public byte AvailabilityStatusId { get; set; }
        public string ReportingSupervisorIds { get; set; }
        public string ReportingManagerIds { get; set; }
        public string Skills { get; set; }
        public int Mode { get; set; }
        public string PstnNumber { get; set; }
        public string ProfileImagePath { get; set; }
        public string SipUserName { get; set; }
        public string SipUserPassword { get; set; }
        public int gatewayID { get; set; }
        public string PortNumber { get; set; }
        public int LoginType { get; set; }
        public int OutBoundAccessType { get; set; }
    }
}
