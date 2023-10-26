import { Component,OnInit } from '@angular/core';

import { UserServiceService } from 'src/app/services/user-service.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/authentication.service';
@Component({
  selector: 'app-usernavbar',
  templateUrl: './usernavbar.component.html',
  styleUrls: ['./usernavbar.component.css']
})
export class UsernavbarComponent implements OnInit{
  
  
  name: any;
  userId: any;
  
  constructor(
    private userService: UserServiceService,
    private router:Router,
    private authservice:AuthService){

  }
  
  logout()
  {
    localStorage.removeItem('token');
    sessionStorage.clear();
    window.history.pushState({}, '', '/');
    
    this.router.navigateByUrl('/Login');
    localStorage.removeItem('token');
    
    localStorage.removeItem('emailId');
    localStorage.removeItem('userId')

  
  
    
  }

  ngOnInit() {
    const email = localStorage.getItem('emailId');
    if (email) {
      this.getUserDetails(email);
    } else {
      
      this.router.navigate(['/login']);
    }
  }
  
  
  getUserDetails(email: string): void {
    this.userService.getUserByEmail(email).subscribe(
      (response) => {
       
        const name = response.name;
      const userId = response.id;
      localStorage.setItem('userId', userId);
    
        
      this.name=name;
      this.userId=userId;
      },
      (error) => {
        
        console.error(error);
      }
    );
  }
  
}

