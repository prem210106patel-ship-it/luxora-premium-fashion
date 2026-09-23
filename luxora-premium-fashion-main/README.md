# LUXORA: Premium Fashion

Build a modern, premium and fully responsive fashion e-commerce website called LUXORA.

The website should look like a real production-ready online fashion store. Use a clean, modern, minimal UI with smooth animations and excellent spacing. Do NOT add any AI chatbot or AI feature inside the website.

Tech & UI

Use React with TypeScript.

Use Tailwind CSS for styling.

Use reusable components.

Use Lucide React icons.

Use smooth animations and micro-interactions.

Fully responsive for desktop, tablet and mobile.

Use a consistent premium fashion-store design throughout the website.

Use realistic product images from suitable image URLs/placeholders.

Make all buttons, links, filters and interactions functional.

Pages

1. Home Page

Create:

Sticky responsive navbar

LUXORA logo

Navigation: Home, Shop, Men, Women, Accessories

Search icon

Wishlist icon

Cart icon with item count

User/account icon

Large hero section with fashion image

Hero heading and CTA buttons

Featured Categories

New Arrivals

Best Sellers

Promotional banner

Trending Products

Customer testimonials

Newsletter section

Footer

2. Shop Page

Create a complete product listing page with:

Product grid

Search products

Category filter

Price range filter

Size filter

Color filter

Rating filter

Sort by price, newest and popularity

Product count

Responsive mobile filter drawer

Create at least 20 realistic products with:

Product ID

Product name

Category

Price

Original price

Discount

Images

Sizes

Colors

Rating

Review count

Description

Stock status

3. Product Details Page

Create:

Large product image gallery

Thumbnail images

Product name

Rating and reviews

Current price

Original price

Discount percentage

Size selection

Color selection

Quantity selector

Add to Cart button

Buy Now button

Wishlist button

Product description

Product specifications

Shipping information

Return policy

Customer reviews

Related products

4. Shopping Cart

Create a functional cart:

Product image

Product name

Selected size/color

Quantity controls

Remove item

Wishlist option

Subtotal

Discount

Shipping

Total

Apply coupon field

Proceed to Checkout button

The cart should persist during navigation using localStorage.

5. Checkout

Create a clean multi-section checkout page:

Customer information

Email

Phone

Shipping address

City

State

Pincode

Delivery method

Payment method UI

Order summary

Coupon/discount

Place Order button

For now, payment can be a simulated checkout flow. Do not integrate a real payment gateway.

6. Login & Register

Create:

Login page

Registration page

Forgot password UI

Form validation

Password visibility toggle

Clean modern design

Authentication can initially use mock/local state.

7. Wishlist

Create a functional wishlist:

Add/remove products

Wishlist product grid

Move to cart

Empty wishlist state

Persist wishlist using localStorage

8. My Account

Create:

Profile information

My Orders

Order details

Wishlist

Saved addresses

Logout button

9. Order Success

After placing an order, show:

Success message

Order number

Order summary

Estimated delivery

Continue Shopping button

View Orders button

10. About Page

Create a professional LUXORA brand story:

Brand introduction

Mission

Values

Fashion imagery

Statistics

Team/brand section

11. Contact Page

Create:

Contact form

Name

Email

Phone

Subject

Message

Contact information

Social media links

Map placeholder

Components

Create reusable components such as:

Navbar

Footer

ProductCard

ProductGrid

ProductFilter

SearchBar

CategoryCard

RatingStars

PriceDisplay

QuantitySelector

CartItem

OrderSummary

Button

Modal

Toast notification

Loading state

Empty state

Product Data

Keep product data in a separate structured file so products can easily be added or edited later.

Use categories:

Men

Women

Accessories

Include products such as:

T-shirts

Shirts

Jeans

Jackets

Dresses

Hoodies

Sneakers

Bags

Watches

Sunglasses

UX Requirements

Make the website feel like a real e-commerce application.

Include:

Loading states

Empty states

Error states

Toast notifications

Hover effects

Smooth page transitions

Product image hover effect

Sticky navbar

Responsive mobile navigation

Accessible buttons and forms

Proper form validation

Mobile-friendly checkout

Important

Do not create an AI chatbot or AI-related feature inside the website.

Build the website with clean, maintainable, reusable code. Avoid putting everything into one component.

Before finishing, test all major user flows:

Home → Shop → Product → Add to Cart → Cart → Checkout → Order Success

Also test:

Product → Wishlist → Wishlist → Move to Cart

Make sure there are no broken routes, buttons or console errors.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/9202b6bf-67c2-426c-b081-83237e9ab215).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
