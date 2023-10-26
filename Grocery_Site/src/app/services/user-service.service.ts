import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CartItem1 } from '../Models/CartItem';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  static addToCart: any;

  constructor(private http: HttpClient){}
  Url = "https://localhost:6700";

  
  getUserByEmail(Email: string): Observable<any> {
    return this.http.get<any>(this.Url + '/api/User/GetUserByEmail?email=' + Email);
  }
  addToCart(cart: CartItem1): Observable<any> {
    const url = `${this.Url}/api/Cart/addtocart`;
    return this.http.post(url, cart);
  }
  

  getUserCart(userId: string): Observable<any> {
    const url = `${this.Url}/api/Cart/getCartItems?userId=${userId}`;
    return this.http.get(url);
  }

  addOrder(order: any): Observable<any> {
    const url = `${this.Url}/api/Order/addorder`;
    return this.http.post(url, order);
  }
  getUserOrders(userId: string): Observable<any> {
    const url = `${this.Url}/api/Order/getorders?userId=${userId}`;
    return this.http.get(url);
  }
  emptyUserCart(userId: string): Observable<any> {
    const url = this.Url + "/api/Cart/emptyusercart?userId=" + userId;
    return this.http.post(url, {});
  }

  deleteCartItem(cartId: string): Observable<any> {
    const url = `${this.Url}/api/Cart/deleteCartItem/${cartId}`;
    return this.http.delete(url);
  }
  addRating(rating: any): Observable<any> {
    const url = `${this.Url}/api/Ratings/AddRatings`;
    return this.http.post(url, rating);
  }

  getAllOrders(): Observable<any> {
    const url = `${this.Url}/api/Order/getallorders`;
    return this.http.get(url);
  }
  
}

