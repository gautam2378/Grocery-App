import { Component } from '@angular/core';

import { UserServiceService } from 'src/app/services/user-service.service';
import { AppComponent } from 'src/app/app.component';
import { ProductService } from 'src/app/services/product.service';
import { Products } from 'src/app/Models/product.model';
@Component({
  selector: 'app-admin-view-recent-orders',
  templateUrl: './admin-view-recent-orders.component.html',
  styleUrls: ['./admin-view-recent-orders.component.css']
})
export class AdminViewRecentOrdersComponent {

  productDetails: any[] = [];
  updatedOrder: any[] = []; 
 
  constructor(private appComponent: AppComponent,
    
    private userService: UserServiceService,
    private productservice: ProductService,) {
    
  }
  ngOnInit(): void {
    this.getOrderDetails();
  }
  getOrderDetails()
  {
    this.userService.getAllOrders().subscribe(
      (response:any) => {
        this.productDetails = response;
        console.log(response)
        for (const item of this.productDetails) {
          console.log(item.productID)
          this.getProductDetails(item.productID);
        }
      },
      (error) => {
        console.log('Error:', error);
      }
    );
  }
  getProductDetails(productId: string) {
    this.productservice.getProductById(productId).subscribe(
      (response: any) => {
        const updatedItem = {
          ...this.productDetails.find((item) => item.productID === productId),
          productName: response.productName,
          image: response.image
        };
        this.updatedOrder.push(updatedItem); 
        console.log(this.updatedOrder); 
      },
      (error: any) => {
        console.log(error); 
      }
    );
  }
}
