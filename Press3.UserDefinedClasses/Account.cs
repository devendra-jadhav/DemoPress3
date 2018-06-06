using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Press3.UserDefinedClasses
{
    public class Account
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Mobile { get; set; }
        public byte Status { get; set; }
        public bool IsEmailVerified { get; set; }
        public Nullable<System.DateTime> EmailVerifiedTime { get; set; }
        public bool IsMobileVerified { get; set; }
        public Nullable<System.DateTime> MobileVerifiedTime { get; set; }
        public int CountryId { get; set; }
        public int TimeZoneId { get; set; }
        public System.DateTime CreatedTime { get; set; }
    }
}
