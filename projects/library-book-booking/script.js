const books = [
 {id:1,title:"The Alchemist",author:"Paulo Coelho",price:250,stock:8,category:"Fiction",isbn:"9780061122415"},
 {id:2,title:"Atomic Habits",author:"James Clear",price:350,stock:12,category:"Self-help",isbn:"9780735211292"},
 {id:3,title:"Rich Dad Poor Dad",author:"Robert T. Kiyosaki",price:300,stock:7,category:"Business",isbn:"9781612680194"},
 {id:4,title:"Clean Code",author:"Robert C. Martin",price:450,stock:5,category:"Technology",isbn:"9780132350884"},
 {id:5,title:"Think Like a Monk",author:"Jay Shetty",price:320,stock:6,category:"Self-help",isbn:"9781982134488"},
 {id:6,title:"The Psychology of Money",author:"Morgan Housel",price:280,stock:9,category:"Business",isbn:"9780857197689"},
 {id:7,title:"Ikigai",author:"Héctor García",price:240,stock:10,category:"Self-help",isbn:"9780143130727"},
 {id:8,title:"Wings of Fire",author:"A. P. J. Abdul Kalam",price:220,stock:8,category:"Biography",isbn:"9788173711466"},
 {id:9,title:"The 5 AM Club",author:"Robin Sharma",price:330,stock:4,category:"Self-help",isbn:"9781443456623"},
 {id:10,title:"The Power of Now",author:"Eckhart Tolle",price:290,stock:6,category:"Self-help",isbn:"9781577314806"},
 {id:11,title:"Deep Work",author:"Cal Newport",price:360,stock:7,category:"Self-help",isbn:"9781455586691"},
 {id:12,title:"The Lean Startup",author:"Eric Ries",price:400,stock:5,category:"Business",isbn:"9780307887894"},
 {id:13,title:"Zero to One",author:"Peter Thiel",price:310,stock:8,category:"Business",isbn:"9780804139298"},
 {id:14,title:"Think and Grow Rich",author:"Napoleon Hill",price:230,stock:11,category:"Business",isbn:"9781585424337"},
 {id:15,title:"The Hobbit",author:"J. R. R. Tolkien",price:340,stock:6,category:"Fiction",isbn:"9780547928227"},
 {id:16,title:"Harry Potter",author:"J. K. Rowling",price:390,stock:9,category:"Fiction",isbn:"9780590353427"},
 {id:17,title:"To Kill a Mockingbird",author:"Harper Lee",price:270,stock:4,category:"Fiction",isbn:"9780061120084"},
 {id:18,title:"Pride and Prejudice",author:"Jane Austen",price:210,stock:7,category:"Fiction",isbn:"9780141439518"},
 {id:19,title:"1984",author:"George Orwell",price:260,stock:8,category:"Fiction",isbn:"9780451524935"},
 {id:20,title:"The Great Gatsby",author:"F. Scott Fitzgerald",price:220,stock:6,category:"Fiction",isbn:"9780743273565"},
 {id:21,title:"Introduction to Algorithms",author:"Thomas H. Cormen",price:750,stock:3,category:"Technology",isbn:"9780262046305"},
 {id:22,title:"Java: The Complete Reference",author:"Herbert Schildt",price:620,stock:5,category:"Technology",isbn:"9781260440232"},
 {id:23,title:"Head First Java",author:"Kathy Sierra",price:580,stock:4,category:"Technology",isbn:"9780596009205"},
 {id:24,title:"Effective Java",author:"Joshua Bloch",price:640,stock:3,category:"Technology",isbn:"9780134685991"},
 {id:25,title:"A Brief History of Time",author:"Stephen Hawking",price:370,stock:5,category:"Science",isbn:"9780553380163"},
 {id:26,title:"Cosmos",author:"Carl Sagan",price:410,stock:4,category:"Science",isbn:"9780345539434"},
 {id:27,title:"Sapiens",author:"Yuval Noah Harari",price:430,stock:7,category:"Science",isbn:"9780062316097"},
 {id:28,title:"Educated",author:"Tara Westover",price:350,stock:5,category:"Biography",isbn:"9780399590504"},
 {id:29,title:"Steve Jobs",author:"Walter Isaacson",price:490,stock:4,category:"Biography",isbn:"9781451648539"},
 {id:30,title:"Man's Search for Meaning",author:"Viktor E. Frankl",price:260,stock:8,category:"Biography",isbn:"9780807014295"}
];

const STORAGE = {users:"library_users_v1", current:"library_current_user_v1", cart:"library_cart_v1", bookings:"library_bookings_v1"};
let currentUser = JSON.parse(localStorage.getItem(STORAGE.current) || "null");
let cart = JSON.parse(localStorage.getItem(STORAGE.cart) || "[]");
let toastTimer;

function save(key, value){ localStorage.setItem(key, JSON.stringify(value)); }
function getUsers(){ return JSON.parse(localStorage.getItem(STORAGE.users) || "[]"); }
function money(value){ return "₹" + Number(value).toLocaleString("en-IN"); }
function coverUrl(book){ return `https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg`; }
function fallbackCover(img, book){
  img.onerror = null;
  img.src = "https://placehold.co/240x320/eaf1fb/214c7a?text=" + encodeURIComponent(book.title);
}
function showToast(message){
  const toast=document.getElementById("toast"); toast.textContent=message; toast.classList.add("show");
  clearTimeout(toastTimer); toastTimer=setTimeout(()=>toast.classList.remove("show"),2600);
}
function showPage(page){
  const protectedPages=["cart","bookings","profile"];
  if(protectedPages.includes(page) && !currentUser){ showToast("Please login first."); page="login"; }
  document.querySelectorAll(".page").forEach(el=>el.classList.add("hidden"));
  const el=document.getElementById(page+"Page");
  if(el) el.classList.remove("hidden");
  document.getElementById("authNav").textContent=currentUser?"Logout":"Login";
  document.getElementById("authNav").onclick=currentUser?logout:()=>showPage("login");
  document.getElementById("cartFloat").classList.toggle("hidden",!currentUser || !["home","cart"].includes(page));
  if(page==="home") renderBooks();
  if(page==="cart") renderCart();
  if(page==="bookings") renderBookings();
  if(page==="profile") renderProfile();
  window.scrollTo({top:0,behavior:"smooth"});
}
function renderBooks(){
  const search=(document.getElementById("searchInput").value||"").trim().toLowerCase();
  const category=document.getElementById("categoryFilter").value;
  const filtered=books.filter(b=>(b.title.toLowerCase().includes(search)||b.author.toLowerCase().includes(search))&&(category==="All"||b.category===category));
  const grid=document.getElementById("bookGrid");
  if(!filtered.length){grid.innerHTML='<div class="empty" style="grid-column:1/-1"><h3>No books found</h3><p>Try a different search.</p></div>';return;}
  grid.innerHTML=filtered.map(b=>`
    <article class="book-card">
      <div class="cover-wrap"><img loading="lazy" src="${coverUrl(b)}" alt="Cover of ${b.title}" onerror="fallbackCover(this,books[${b.id-1}])"></div>
      <span class="category">${b.category}</span><h3>${b.title}</h3><p class="author">${b.author}</p>
      <div class="price">${money(b.price)}</div><p class="stock">${b.stock} available</p>
      <div class="book-actions">
        <input class="quantity" id="qty-${b.id}" type="number" min="1" max="${b.stock}" value="1" aria-label="Quantity for ${b.title}">
        <button class="primary" onclick="addToCart(${b.id})" ${b.stock===0?"disabled":""}>Add</button>
      </div>
    </article>`).join("");
}
function addToCart(id){
  if(!currentUser){showToast("Please login to book a book.");showPage("login");return;}
  const book=books.find(b=>b.id===id), input=document.getElementById("qty-"+id);
  const qty=Number(input.value);
  if(!Number.isInteger(qty)||qty<1||qty>book.stock){showToast(`Enter a quantity from 1 to ${book.stock}.`);return;}
  const existing=cart.find(i=>i.id===id);
  if(existing){if(existing.qty+qty>book.stock){showToast(`Only ${book.stock} copies are available.`);return;}existing.qty+=qty;}
  else cart.push({id,qty});
  save(STORAGE.cart,cart);updateCartCount();showToast(`${book.title} added to your cart.`);
}
function updateCartCount(){document.getElementById("cartCount").textContent=cart.reduce((sum,item)=>sum+item.qty,0);}
function renderCart(){
  const host=document.getElementById("cartContent");
  if(!cart.length){host.innerHTML='<div class="empty"><div class="emoji">🛒</div><h3>Your cart is empty</h3><p>Explore the library and add books to book them.</p><button class="primary" onclick="showPage('home')">Browse Books</button></div>';return;}
  const total=cart.reduce((sum,item)=>{const b=books.find(x=>x.id===item.id);return sum+b.price*item.qty;},0);
  host.innerHTML=`<div class="table-wrap"><table><thead><tr><th>Book</th><th>Price</th><th>Quantity</th><th>Subtotal</th><th>Action</th></tr></thead><tbody>
  ${cart.map(item=>{const b=books.find(x=>x.id===item.id);return `<tr><td><div class="cart-book"><img src="${coverUrl(b)}" alt="" onerror="fallbackCover(this,books[${b.id-1}])"><div><strong>${b.title}</strong><br><small>${b.author}</small></div></div></td><td>${money(b.price)}</td><td><button class="secondary" onclick="changeQty(${b.id},-1)">−</button> <strong>${item.qty}</strong> <button class="secondary" onclick="changeQty(${b.id},1)">+</button></td><td>${money(b.price*item.qty)}</td><td><button class="danger" onclick="removeFromCart(${b.id})">Remove</button></td></tr>`}).join("")}
  </tbody></table></div><div class="cart-bottom"><button class="secondary" onclick="showPage('home')">Continue browsing</button><div class="total">Total: ${money(total)} <button class="primary" onclick="confirmBooking()">Book Now</button></div></div>`;
}
function changeQty(id,delta){
  const item=cart.find(i=>i.id===id), book=books.find(b=>b.id===id); if(!item)return;
  const next=item.qty+delta;if(next<1)return;
  if(next>book.stock){showToast(`Only ${book.stock} copies are available.`);return;}
  item.qty=next;save(STORAGE.cart,cart);updateCartCount();renderCart();
}
function removeFromCart(id){cart=cart.filter(i=>i.id!==id);save(STORAGE.cart,cart);updateCartCount();renderCart();showToast("Book removed from cart.");}
function confirmBooking(){
  if(!currentUser){showPage("login");return;} if(!cart.length)return;
  const bookings=JSON.parse(localStorage.getItem(STORAGE.bookings)||"[]");
  for(const item of cart){const book=books.find(b=>b.id===item.id);if(item.qty>book.stock){showToast(`${book.title} does not have enough stock now.`);return;}}
  const items=cart.map(item=>{const b=books.find(x=>x.id===item.id);b.stock-=item.qty;return {id:b.id,title:b.title,author:b.author,price:b.price,qty:item.qty};});
  const total=items.reduce((sum,i)=>sum+i.price*i.qty,0);
  bookings.unshift({bookingId:"BK"+Date.now().toString().slice(-8),email:currentUser.email,items,total,date:new Date().toLocaleString(),status:"Confirmed"});
  save(STORAGE.bookings,bookings);save("library_stock_v1",books.map(b=>({id:b.id,stock:b.stock})));
  cart=[];save(STORAGE.cart,cart);updateCartCount();renderBooks();showToast("Booking confirmed successfully!");showPage("bookings");
}
function renderBookings(){
  const host=document.getElementById("bookingsContent");
  const all=JSON.parse(localStorage.getItem(STORAGE.bookings)||"[]");
  const mine=all.filter(b=>b.email===currentUser.email);
  if(!mine.length){host.innerHTML='<div class="empty"><div class="emoji">📚</div><h3>No bookings yet</h3><p>Your confirmed bookings will appear here.</p><button class="primary" onclick="showPage('home')">Explore books</button></div>';return;}
  host.innerHTML=mine.map(b=>`<article class="booking-card"><div class="booking-top"><div><strong>Booking ID: ${b.bookingId}</strong><p class="muted">${b.date}</p></div><span class="status">${b.status}</span></div><div class="booking-items">${b.items.map(i=>`<div class="mini-book"><img src="${coverUrl(i)}" alt="" onerror="fallbackCover(this,books[${i.id-1}])"><span>${i.title} × ${i.qty}<br><strong>${money(i.price*i.qty)}</strong></span></div>`).join("")}</div><div class="cart-bottom"><span class="muted">${b.items.reduce((s,i)=>s+i.qty,0)} book(s)</span><strong class="total">Total: ${money(b.total)}</strong></div></article>`).join("");
}
function renderProfile(){
  document.getElementById("profileContent").innerHTML=`<div class="profile-card"><div class="avatar">👤</div><div><h2>${escapeHtml(currentUser.name)}</h2><p class="muted">${escapeHtml(currentUser.email)}</p><p class="muted">Library member</p></div></div><div class="booking-card"><h3>Account</h3><p>Your account is saved in this browser for this demo project.</p><button class="danger" onclick="logout()">Logout</button></div>`;
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
document.getElementById("loginForm").addEventListener("submit",e=>{
  e.preventDefault();const email=document.getElementById("loginEmail").value.trim().toLowerCase(),password=document.getElementById("loginPassword").value;
  const user=getUsers().find(u=>u.email===email&&u.password===password);
  if(!user){showToast("Account not found or password is incorrect. Register first.");return;}
  currentUser={name:user.name,email:user.email};save(STORAGE.current,currentUser);showToast("Welcome back!");showPage("home");
});
document.getElementById("registerForm").addEventListener("submit",e=>{
  e.preventDefault();const name=document.getElementById("registerName").value.trim(),email=document.getElementById("registerEmail").value.trim().toLowerCase(),password=document.getElementById("registerPassword").value;
  const users=getUsers();if(users.some(u=>u.email===email)){showToast("This email is already registered. Please login.");return;}
  users.push({name,email,password});save(STORAGE.users,users);currentUser={name,email};save(STORAGE.current,currentUser);showToast("Account created successfully!");showPage("home");
});
function logout(){currentUser=null;localStorage.removeItem(STORAGE.current);showToast("You have logged out.");showPage("login");}
document.getElementById("searchInput").addEventListener("input",renderBooks);
document.getElementById("categoryFilter").addEventListener("change",renderBooks);

// Restore stock saved after bookings when the page is refreshed.
const savedStock=JSON.parse(localStorage.getItem("library_stock_v1")||"[]");
savedStock.forEach(item=>{const book=books.find(b=>b.id===item.id);if(book)book.stock=item.stock;});
updateCartCount();
showPage(currentUser?"home":"login");
