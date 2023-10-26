import { Component, OnInit } from '@angular/core';

import { UserServiceService } from 'src/app/services/user-service.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-user-orders',
  templateUrl: './user-orders.component.html',
  styleUrls: ['./user-orders.component.css']
})
export class UserOrdersComponent implements OnInit {
  productDetails: any[] = [];
  updatedOrder: any[] = []; 

  constructor(
    private OrderService: UserServiceService,
    
    private productservice: ProductService
  ) {}

  ngOnInit(): void {
    const userId = localStorage.getItem('userId') as string;

    this.OrderService.getUserOrders(userId).subscribe(
      (response: any[]) => {
        this.productDetails = response;
        console.log(this.productDetails); 

        for (const item of this.productDetails) {
          this.getProductDetails(item.productID);
        }
      },
      (error: any) => {
        console.log(error); 
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
