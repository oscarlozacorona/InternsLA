  
using System;
using System.Collections.Generic;
using System.Text;

namespace Sabio.Models.Domain
{
    public class Login
    {
        public Login(bool createdProfile)
        {
            this.createdProfile = createdProfile;
        }

        public int Id { get; set; }

        public bool createdProfile { get; set; }

        public List<Role> Roles { get; set; }
    }
}
