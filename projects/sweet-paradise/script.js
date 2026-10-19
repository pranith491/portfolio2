const sweets = [
  ["Gulab Jamun",40],["Kaju Katli",120],["Motichoor Laddu",60],["Rasgulla",50],
  ["Jalebi",40],["Mysore Pak",80],["Rasmalai",70],["Soan Papdi",55],
  ["Milk Peda",65],["Badusha",50],["Coconut Laddu",60],["Boondi Laddu",55],
  ["Besan Laddu",65],["Cham Cham",70],["Palkova",90],["Malai Sandwich",80],
  ["Kalakand",75],["Kova Kajjikayalu",70],["Ariselu",60],["Pootharekulu",100],
  ["Dry Fruit Laddu",130],["Chocolate Barfi",85],["Pista Roll",110],["Anjeer Sweet",140],
  ["Carrot Halwa",90],["Badam Halwa",120],["Kesar Peda",80],["Dharwad Peda",75],
  ["Soan Roll",65],["Imarti",50]
].map(([name,price],index)=>({name,price,image:`images/sweet-${String(index+1).padStart(2,"0")}.jpg`}));

const sweetContainer=document.getElementById("sweetContainer");
const cartItems=document.getElementById("cartItems");
const cartCount=document.getElementById("cartCount");
const cartTotal=document.getElementById("cartTotal");
const quantities={};
const cart={};

sweets.forEach((sweet,index)=>{
  quantities[index]=1;
  const card=document.createElement("article");
  card.className="sweet-card";

  const image=document.createElement("img");
  image.src=sweet.image;
  image.alt=sweet.name;
  image.loading="lazy";

  const details=document.createElement("div");
  details.className="sweet-details";
  const name=document.createElement("h3");
  name.textContent=`${index+1}. ${sweet.name}`;
  const price=document.createElement("p");
  price.className="price";
  price.textContent=`₹${sweet.price}`;

  const controls=document.createElement("div");
  controls.className="quantity-control";
  const minus=document.createElement("button");
  minus.type="button"; minus.textContent="−"; minus.setAttribute("aria-label",`Decrease ${sweet.name}`);
  const value=document.createElement("span");
  value.className="quantity-value"; value.textContent="1";
  const plus=document.createElement("button");
  plus.type="button"; plus.textContent="+"; plus.setAttribute("aria-label",`Increase ${sweet.name}`);

  minus.addEventListener("click",()=>{if(quantities[index]>1){quantities[index]--;value.textContent=quantities[index];}});
  plus.addEventListener("click",()=>{if(quantities[index]<100){quantities[index]++;value.textContent=quantities[index];}});
  controls.append(minus,value,plus);

  const add=document.createElement("button");
  add.className="add-btn";add.type="button";add.textContent="Add to Cart";
  add.addEventListener("click",()=>addToCart(index));

  details.append(name,price,controls,add);
  card.append(image,details);
  sweetContainer.appendChild(card);
});

function addToCart(index){
  const sweet=sweets[index],quantity=quantities[index];
  if(cart[index])cart[index].quantity+=quantity;
  else cart[index]={name:sweet.name,price:sweet.price,quantity};
  updateCart();
}

function updateCart(){
  cartItems.replaceChildren();
  let total=0,count=0;
  const entries=Object.entries(cart);
  if(entries.length===0){
    const empty=document.createElement("p");
    empty.className="empty-cart";empty.textContent="Your cart is empty. Add some sweets!";
    cartItems.appendChild(empty);
  }
  entries.forEach(([key,item])=>{
    const subtotal=item.price*item.quantity;
    total+=subtotal;count+=item.quantity;
    const row=document.createElement("div");row.className="cart-row";
    const description=document.createElement("span");
    description.textContent=`${item.name} × ${item.quantity} = ₹${subtotal}`;
    const remove=document.createElement("button");
    remove.type="button";remove.textContent="Remove";
    remove.addEventListener("click",()=>{delete cart[key];updateCart();});
    row.append(description,remove);cartItems.appendChild(row);
  });
  cartCount.textContent=count;
  cartTotal.textContent=`₹${total}`;
}

document.getElementById("clearCart").addEventListener("click",()=>{
  Object.keys(cart).forEach(key=>delete cart[key]);
  updateCart();
});

document.getElementById("loginForm").addEventListener("submit",event=>{
  event.preventDefault();
  document.getElementById("loginMessage").textContent=
    "Demo form submitted. Real authentication requires a secure backend.";
  event.target.reset();
});

updateCart();
