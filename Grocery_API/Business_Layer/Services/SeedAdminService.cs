﻿using Business_Layer.IServices;
using DataAccessLayer.data;
using DataAccessLayer.models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Business_Layer.Services
{
	public class SeedAdminService : ISeedAdminService
	{
		private readonly APIDbContext _dbContext;

		public SeedAdminService(APIDbContext dbContext)
		{
			_dbContext = dbContext;
		}

		public async Task<bool> SeedAdminUser()
		{
			string adminEmail = "gautamyadav@gmail.com";
			string adminPassword = "Gautam@12";
			string adminName = "Admin User ";
			string phone = "9958734601";

			var adminUser = await _dbContext.Registers.FirstOrDefaultAsync(u => u.email == adminEmail);
			if (adminUser != null)
			{
				return false; 
			}

			var admin = new Register
			{
				ID = Guid.NewGuid(),
				email = adminEmail,
				password = adminPassword,
				name = adminName,
				phone = phone,
				registrationType = "admin"
				
			};

			_dbContext.Registers.Add(admin);
			await _dbContext.SaveChangesAsync();

			return true;
		}
	}

}
