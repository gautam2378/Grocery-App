import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Products } from 'src/app/Models/product.model';
import { ProductService } from 'src/app/services/product.service';
import { AppComponent } from 'src/app/app.component';
import { CartItem1 } from 'src/app/Models/CartItem';
import { UserServiceService } from 'src/app/services/user-service.service';
import { Ratings } from 'src/app/Models/Ratings';
import { Review } from 'src/app/Models/Review';

@Component({
  selector: 'app-product-user-view',
  templateUrl: './product-user-view.component.html',
  styleUrls: ['./product-user-view.component.css']
})
export class ProductUserViewComponent implements OnInit {
  productId!: string;
  product!: Products;
  productQuantity: number = 1;
  selectedRating: number = 0;
  showSuccessAlert1: boolean = false;
  showFailureAlert1: boolean = false;
  showSuccessAlert2: boolean = false;
  showFailureAlert2: boolean = false;
  showFailureAlert3: boolean = false;
  showSuccessAlert3: boolean = false;
  showFailureAlert4: boolean = false;
  cartItem: CartItem1 = {
    
    productId: '',
    userID: '',
    productQuantity: 1,
  };
  ratings: Ratings = {
    rating: 0,
    productId: ''
  };
  reviews: Review[] = [];
  newReview: Review = {
    userName: '',
    review: '',
    productId: ''
  };

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private appcomponent: AppComponent,
    private userservice: UserServiceService
  ) {
    this.appcomponent.showNavBar = false;
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.productId = params['id'];
      this.getProductDetails();
      
    });
  }

  
  getProductDetails() {
    this.productService.getProductById(this.productId).subscribe(
      response => {
        this.product = response;
        console.log(response);
      },
      error => {
        
      }
    );
  }

  addToCart() {
    this.cartItem.userID = localStorage.getItem('userId') as string;
    this.cartItem.productId = this.product.id;
    this.cartItem.productQuantity = this.productQuantity;

    if (this.productQuantity > this.product.availableQuantity) {
      this.showFailureAlert3 = true;

      setTimeout(() => {
        this.showFailureAlert3 = false;
      }, 3000);
    } else {
      this.userservice.addToCart(this.cartItem).subscribe(
        (response: any) => {
          console.log("product added", response);
          this.showSuccessAlert1 = true;

          setTimeout(() => {
            this.showSuccessAlert1 = false;
          }, 3000);
        },
        (error: any) => {
          console.error(error);
          this.showFailureAlert1 = true;

          setTimeout(() => {
            this.showFailureAlert1 = false;
          }, 3000);
        }
      );
    }
  }

  selectRating(rating: number) {
    this.selectedRating = rating;
  }

  submitRating() {
    this.ratings.rating = this.selectedRating;
    this.ratings.productId = this.productId;
    this.userservice.addRating(this.ratings).subscribe(
      (response: any) => {
        this.showSuccessAlert2 = true;

        setTimeout(() => {
          this.showSuccessAlert2 = false;
        }, 3000);
      },
      (error: any) => {
        console.error(error);
        this.showFailureAlert2 = true;

        setTimeout(() => {
          this.showFailureAlert2 = false;
        }, 3000);
      }
    );
  }

  submitReview() {
    this.newReview.productId = this.product.id;
    
    
    const existingReview = this.reviews.find(review => review.userName === this.newReview.userName);
    if (existingReview) {
      
      this.showFailureAlert4 = true;
    
      setTimeout(() => {
        this.showFailureAlert4 = false;
      }, 5000);
    
      return;
    }
    
    
  }
}
