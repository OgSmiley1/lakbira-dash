# La Kbira Admin Dashboard - User Guide

**Version:** 1.0  
**Last Updated:** October 2024  
**Author:** Manus AI

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Dashboard Overview](#dashboard-overview)
3. [Order Management](#order-management)
4. [Client Management](#client-management)
5. [Media Management](#media-management)
6. [Collections Management](#collections-management)
7. [Audit Logs](#audit-logs)
8. [AI Insights](#ai-insights)
9. [Settings](#settings)
10. [Troubleshooting](#troubleshooting)

---

## Getting Started

### Admin Login

The admin dashboard is accessible at `/admin/login`. Use the following default credentials on first login:

| Field | Value |
|-------|-------|
| **Username** | Moath121 |
| **Password** | Dash001 |

> **Security Notice:** Change your password immediately after first login. Default credentials should never be used in production.

### First Time Setup

1. Navigate to `https://yourdomain.com/admin/login`
2. Enter the default credentials
3. You will be redirected to the admin dashboard
4. Change your password in the Settings tab
5. Configure your preferences in the Settings tab

---

## Dashboard Overview

The admin dashboard provides a comprehensive view of your La Kbira business operations. The main interface is organized into several tabs:

### Dashboard Tabs

| Tab | Purpose |
|-----|---------|
| **Overview** | View key statistics and dashboard metrics |
| **Orders** | Manage customer orders and approvals |
| **Clients** | View and manage customer profiles |
| **Media** | Upload and manage images and videos |
| **Collections** | Create and manage product collections |
| **Audit** | Review all admin actions and changes |
| **AI** | Access AI-powered insights and recommendations |
| **Settings** | Configure platform settings |

### Key Metrics

The Overview tab displays four key metrics:

- **Total Orders:** Complete count of all orders in the system
- **Pending Orders:** Orders awaiting admin approval
- **Approved Orders:** Orders that have been approved
- **Total Clients:** Number of registered customers

---

## Order Management

### Viewing Orders

The Orders tab displays all customer orders with the following information:

- Customer name and contact details
- Product, color, and size selections
- Order location (city, country)
- Order status (pending, approved, rejected)
- Order date and time

### Approving Orders

To approve a pending order:

1. Navigate to the **Orders** tab
2. Locate the pending order in the list
3. Click the **Approve** button
4. Optionally add admin notes
5. Confirm the approval

**What happens when you approve an order:**
- Order status changes to "approved"
- Customer receives notification
- Order is added to production queue
- Audit log records the action

### Rejecting Orders

To reject an order:

1. Navigate to the **Orders** tab
2. Locate the order to reject
3. Click the **Reject** button
4. Enter a reason for rejection (required)
5. Confirm the rejection

**What happens when you reject an order:**
- Order status changes to "rejected"
- Customer receives notification with rejection reason
- Order is removed from production queue
- Audit log records the action and reason

### Order Status Workflow

```
Pending → Approved → Deposit Paid → In Production → Ready → Shipped → Delivered
                   ↓
                Rejected
```

---

## Client Management

### Viewing Clients

The Clients tab displays all registered customers with:

- Full name and contact information
- Email address and phone number
- Shipping location (city, country)
- Member since date
- Order history

### Client Profiles

Each client profile shows:

- **Personal Information:** Name, email, phone
- **Location:** City and country
- **Account Status:** Active or inactive
- **Order History:** All orders placed by the client
- **Total Spent:** Cumulative order value
- **Member Since:** Account creation date

### Client Actions

From the client profile, you can:

- View complete order history
- See order details and status
- Contact customer information
- Track customer preferences

---

## Media Management

### Uploading Media

The Media tab allows you to upload images and videos for your collections:

1. Navigate to the **Media** tab
2. Click **Upload New Media**
3. Select file type (image or video)
4. Choose file from your computer
5. Add title and description
6. Click **Upload**

### Supported Formats

| Type | Formats | Max Size |
|------|---------|----------|
| **Images** | JPG, PNG, WebP | 10 MB |
| **Videos** | MP4, WebM, MOV | 50 MB |

### Media Usage

Uploaded media can be:

- Set as collection cover images
- Used in product galleries
- Embedded in collection descriptions
- Featured on the homepage

---

## Collections Management

### Creating Collections

To create a new collection:

1. Navigate to the **Collections** tab
2. Click **Create New Collection**
3. Fill in collection details:
   - **English Name:** Collection name in English
   - **Arabic Name:** Collection name in Arabic
   - **Description:** Detailed collection description
   - **Story:** Background story or inspiration
   - **Cover Image:** Select from uploaded media
   - **Video:** Optional collection video
4. Click **Create Collection**

### Collection Details

Each collection includes:

| Field | Description |
|-------|-------------|
| **Name (EN/AR)** | Collection name in both languages |
| **Description** | Detailed product description |
| **Story** | Collection inspiration and background |
| **Cover Image** | Featured collection image |
| **Video URL** | Optional promotional video |
| **Status** | Active or inactive |
| **Created Date** | Collection creation timestamp |

### Managing Collections

From the Collections tab, you can:

- **Edit:** Update collection information
- **Delete:** Remove collection (with confirmation)
- **Activate/Deactivate:** Control collection visibility
- **View Products:** See products in collection

---

## Audit Logs

### Understanding Audit Logs

The Audit tab provides a complete record of all admin actions taken in the system. This includes:

- Order approvals and rejections
- Collection creation and updates
- Media uploads
- Settings changes
- User actions

### Audit Log Details

Each log entry contains:

| Field | Description |
|-------|-------------|
| **Timestamp** | Date and time of action |
| **User** | Admin who performed the action |
| **Action** | Type of action performed |
| **Entity Type** | What was modified (order, collection, etc.) |
| **Entity ID** | Specific item affected |
| **Status** | Success or error |
| **Changes** | What was modified |
| **IP Address** | Admin's IP address |

### Filtering Audit Logs

You can filter logs by:

- **User:** Which admin performed the action
- **Action:** Type of action (approve, create, update, etc.)
- **Entity Type:** What was affected
- **Date Range:** Custom date filtering
- **Status:** Success or error only

### Audit Log Use Cases

- **Compliance:** Track all changes for regulatory requirements
- **Troubleshooting:** Identify when issues occurred
- **Security:** Monitor for unauthorized access
- **Analytics:** Understand usage patterns

---

## AI Insights

### System Health

The AI tab displays real-time system health information:

- **Overall Status:** Healthy, degraded, or unhealthy
- **Component Status:** Database, API, storage, cache
- **Last Check:** When health was last verified
- **Performance Metrics:** CPU, memory, uptime

### Market Analysis

AI-powered market insights including:

- **Trends:** Current market trends affecting your business
- **Opportunities:** Potential growth opportunities
- **Threats:** Market challenges to monitor

### Inventory Optimization

AI recommendations for inventory management:

- **Stock Adjustments:** Recommended percentage changes
- **Demand Forecast:** Predicted demand by product
- **Seasonal Trends:** Seasonal demand patterns

### Customer Retention

Churn prediction and retention strategies:

- **At-Risk Customers:** Customers likely to stop ordering
- **Retention Strategies:** Recommended actions to retain customers
- **Loyalty Programs:** Suggestions for customer loyalty

### Automation Controls

Manage automated system tasks:

- **Run Daily Tasks:** Execute scheduled automation
- **Sync Data:** Synchronize with external systems
- **Last Sync:** When data was last synchronized

---

## Settings

### General Settings

Configure basic platform settings:

- **Slideshow Speed:** Control background image rotation speed (1-30 seconds)
- **Notifications:** Enable/disable email notifications
- **Maintenance Mode:** Put platform in maintenance mode

### Security Settings

Manage security and access:

- **Change Password:** Update your admin password
- **Two-Factor Authentication:** Enable 2FA (if available)
- **Active Sessions:** View and manage login sessions
- **API Keys:** Generate and manage API keys

### Notification Preferences

Configure how you receive notifications:

- **Email Notifications:** Enable/disable email alerts
- **Order Notifications:** Alerts for new orders
- **System Alerts:** Critical system notifications
- **Digest Frequency:** Daily, weekly, or monthly summaries

---

## Troubleshooting

### Common Issues

#### Cannot Login

**Problem:** Login credentials not working

**Solution:**
1. Verify username and password are correct
2. Check Caps Lock is off
3. Clear browser cookies and cache
4. Try a different browser
5. Contact support if issue persists

#### Orders Not Appearing

**Problem:** Orders not showing in the Orders tab

**Solution:**
1. Refresh the page (Ctrl+R or Cmd+R)
2. Check date filters
3. Verify you have admin access
4. Check browser console for errors
5. Contact support if issue persists

#### Media Upload Fails

**Problem:** Cannot upload images or videos

**Solution:**
1. Check file size (max 50 MB for videos, 10 MB for images)
2. Verify file format is supported
3. Check internet connection
4. Try a different browser
5. Contact support if issue persists

#### Slow Performance

**Problem:** Dashboard is slow or unresponsive

**Solution:**
1. Check internet connection speed
2. Clear browser cache
3. Close unnecessary browser tabs
4. Restart your browser
5. Check system health in AI tab
6. Contact support if issue persists

### Getting Help

If you encounter issues not covered in this guide:

1. **Check the Audit Logs** - Review recent actions for clues
2. **Check System Health** - Verify all systems are operational
3. **Clear Cache** - Clear browser cache and cookies
4. **Restart Browser** - Close and reopen your browser
5. **Contact Support** - Reach out to the support team with:
   - Description of the issue
   - Steps to reproduce
   - Browser and OS information
   - Screenshots if applicable

### Performance Tips

To ensure optimal dashboard performance:

- Use a modern web browser (Chrome, Firefox, Safari, Edge)
- Keep your browser updated
- Disable unnecessary browser extensions
- Use a stable internet connection
- Clear browser cache regularly
- Close unused browser tabs

---

## Best Practices

### Order Management

- **Review Orders Regularly:** Check for pending orders multiple times daily
- **Add Notes:** Include context when approving/rejecting orders
- **Communicate:** Notify customers of order status changes
- **Track Deadlines:** Monitor production timelines

### Security

- **Change Default Password:** Never use default credentials in production
- **Use Strong Passwords:** Create complex, unique passwords
- **Monitor Audit Logs:** Regularly review admin actions
- **Limit Access:** Only grant admin access to trusted users
- **Log Out:** Always log out when finished

### Data Management

- **Regular Backups:** Ensure data is backed up regularly
- **Archive Old Data:** Archive completed orders periodically
- **Monitor Storage:** Check available storage space
- **Update Information:** Keep customer data current

### Customer Service

- **Respond Promptly:** Address customer inquiries quickly
- **Provide Context:** Include details in order communications
- **Track Preferences:** Note customer preferences for future orders
- **Gather Feedback:** Collect customer feedback for improvements

---

## Support & Contact

For additional support or questions:

- **Email:** support@lakbira.ae
- **Phone:** +971 XX XXX XXXX
- **Website:** www.lakbira.ae
- **Hours:** Sunday - Thursday, 9 AM - 6 PM GST

---

**Document Version:** 1.0  
**Last Updated:** October 2024  
**Next Review:** January 2025

