# 博物館展覽與購票系統（Museum Exhibition Management and Ticketing System）

This repository is the final project for the *Database Management* course by Group 5. The project aims to implement a complete system with a complex and well-optimized relational database. We selected museum exhibition management as our topic to assist a large museum with multiple buildings and numerous exhibition halls.

## 🛠️ Features
### **Exhibition Management**
- Customers can search for exhibitions based on their status, category, date, exhibition name, and building name.
- Staff can add, edit, and delete exhibitions and their related records (e.g., volunteer assignments, sponsorships, staff assignments).

### **Ticket Sales and Management**
- Customers can search for tickets by type, exhibition name, building name, or customer identity.
- To purchase tickets, customers only need to select the desired quantity, provide a phone number, and choose a payment method.
- Customers can view their ticket purchase history by entering their phone number.
- Staff can add and edit tickets, specifying the exhibitions each ticket grants access to.

### **Ticket Sales Analysis**
- Staff can review ticket transaction records and analyze total sales and revenue within a specified time frame and ticket attributes with a visualized graph.

## 📖 System Highlights
1. **Indexing:** Create indices to speed up frequently used queries and complex queries.
2. **Transaction Control:** Implemented locks to manage concurrency issues.

## ⏩️ Execution Steps
1. Open pdAdmin 4 and import the specified `Museum.backup` file.
2. In the project's root directory, open the terminal and enter the following commands:
<pre>node server.js # Start backend server 
cd museum-webpage # Switch to the folder containing the frontend framework
ng serve -o # Launch the webpage</pre>
3. Append `home` to the end of the URL in your browser.

## 其他事項說明
1. To register an administrator, change the URL to ```/register```; otherwise, the admin panel will not be displayed.
2. If the bar chart in the transaction analysis section appears too small, reloading the page should resolve the issue.
