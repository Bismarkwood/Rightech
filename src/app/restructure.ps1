$appDir = "C:\Users\atoba\Downloads\Rightech\src\app"
$coreDir = Join-Path $appDir "core"
$modulesDir = Join-Path $appDir "modules"

# Helper function to create module structure
function New-ModuleStructure ($moduleName) {
    $modDir = Join-Path $modulesDir $moduleName
    New-Item -ItemType Directory -Force -Path (Join-Path $modDir "components") | Out-Null
    New-Item -ItemType Directory -Force -Path (Join-Path $modDir "pages") | Out-Null
    New-Item -ItemType Directory -Force -Path (Join-Path $modDir "context") | Out-Null
}

# 1. Create Core Structure
New-Item -ItemType Directory -Force -Path (Join-Path $coreDir "components") | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $coreDir "context") | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $coreDir "data") | Out-Null

# 2. Modules to create
$moduleNames = @(
    "auth", "business", "consignment", "credit", "dealer", "delivery", 
    "finance", "orders", "payments", "products", "retailer", "shipment", 
    "storefront", "supply"
)

foreach ($mod in $moduleNames) {
    New-ModuleStructure $mod
}

# 3. Move Core Items
if (Test-Path (Join-Path $appDir "components\ui")) {
    Move-Item -Path (Join-Path $appDir "components\ui") -Destination (Join-Path $coreDir "components") -Force
}
if (Test-Path (Join-Path $appDir "components\DashboardLayout.tsx")) {
    Move-Item -Path (Join-Path $appDir "components\DashboardLayout.tsx") -Destination (Join-Path $coreDir "components") -Force
}
if (Test-Path (Join-Path $appDir "components\NotificationCenter.tsx")) {
    Move-Item -Path (Join-Path $appDir "components\NotificationCenter.tsx") -Destination (Join-Path $coreDir "components") -Force
}

if (Test-Path (Join-Path $appDir "context\AuthContext.tsx")) {
    Move-Item -Path (Join-Path $appDir "context\AuthContext.tsx") -Destination (Join-Path $coreDir "context") -Force
}
if (Test-Path (Join-Path $appDir "context\NotificationContext.tsx")) {
    Move-Item -Path (Join-Path $appDir "context\NotificationContext.tsx") -Destination (Join-Path $coreDir "context") -Force
}

if (Test-Path (Join-Path $appDir "data\*")) {
    Move-Item -Path (Join-Path $appDir "data\*") -Destination (Join-Path $coreDir "data") -Force
}

# 4. Move Module Items

# Auth
if (Test-Path (Join-Path $appDir "pages\Auth.tsx")) { Move-Item (Join-Path $appDir "pages\Auth.tsx") (Join-Path $modulesDir "auth\pages") -Force }

# Business
if (Test-Path (Join-Path $appDir "pages\BusinessManagement.tsx")) { Move-Item (Join-Path $appDir "pages\BusinessManagement.tsx") (Join-Path $modulesDir "business\pages") -Force }

# Consignment
if (Test-Path (Join-Path $appDir "components\consignment\*")) { Move-Item (Join-Path $appDir "components\consignment\*") (Join-Path $modulesDir "consignment\components") -Force }
if (Test-Path (Join-Path $appDir "pages\ConsignmentManagement.tsx")) { Move-Item (Join-Path $appDir "pages\ConsignmentManagement.tsx") (Join-Path $modulesDir "consignment\pages") -Force }
if (Test-Path (Join-Path $appDir "context\ConsignmentContext.tsx")) { Move-Item (Join-Path $appDir "context\ConsignmentContext.tsx") (Join-Path $modulesDir "consignment\context") -Force }

# Credit
if (Test-Path (Join-Path $appDir "components\credit\*")) { Move-Item (Join-Path $appDir "components\credit\*") (Join-Path $modulesDir "credit\components") -Force }
if (Test-Path (Join-Path $appDir "pages\CreditManagement.tsx")) { Move-Item (Join-Path $appDir "pages\CreditManagement.tsx") (Join-Path $modulesDir "credit\pages") -Force }
if (Test-Path (Join-Path $appDir "context\CreditContext.tsx")) { Move-Item (Join-Path $appDir "context\CreditContext.tsx") (Join-Path $modulesDir "credit\context") -Force }

# Dealer
if (Test-Path (Join-Path $appDir "components\dealers\*")) { Move-Item (Join-Path $appDir "components\dealers\*") (Join-Path $modulesDir "dealer\components") -Force }
if (Test-Path (Join-Path $appDir "pages\DealerManagement.tsx")) { Move-Item (Join-Path $appDir "pages\DealerManagement.tsx") (Join-Path $modulesDir "dealer\pages") -Force }

# Delivery
if (Test-Path (Join-Path $appDir "components\delivery\*")) { Move-Item (Join-Path $appDir "components\delivery\*") (Join-Path $modulesDir "delivery\components") -Force }
if (Test-Path (Join-Path $appDir "pages\DeliveryManagement.tsx")) { Move-Item (Join-Path $appDir "pages\DeliveryManagement.tsx") (Join-Path $modulesDir "delivery\pages") -Force }
if (Test-Path (Join-Path $appDir "context\DeliveryContext.tsx")) { Move-Item (Join-Path $appDir "context\DeliveryContext.tsx") (Join-Path $modulesDir "delivery\context") -Force }

# Finance
if (Test-Path (Join-Path $appDir "pages\Finance.tsx")) { Move-Item (Join-Path $appDir "pages\Finance.tsx") (Join-Path $modulesDir "finance\pages") -Force }

# Orders
if (Test-Path (Join-Path $appDir "components\orders\*")) { Move-Item (Join-Path $appDir "components\orders\*") (Join-Path $modulesDir "orders\components") -Force }
if (Test-Path (Join-Path $appDir "pages\RetailerOrderDetails.tsx")) { Move-Item (Join-Path $appDir "pages\RetailerOrderDetails.tsx") (Join-Path $modulesDir "orders\pages") -Force }
if (Test-Path (Join-Path $appDir "context\OrderManagementContext.tsx")) { Move-Item (Join-Path $appDir "context\OrderManagementContext.tsx") (Join-Path $modulesDir "orders\context") -Force }

# Payments
if (Test-Path (Join-Path $appDir "components\payments\*")) { Move-Item (Join-Path $appDir "components\payments\*") (Join-Path $modulesDir "payments\components") -Force }
if (Test-Path (Join-Path $appDir "pages\PaymentManagement.tsx")) { Move-Item (Join-Path $appDir "pages\PaymentManagement.tsx") (Join-Path $modulesDir "payments\pages") -Force }
if (Test-Path (Join-Path $appDir "context\PaymentContext.tsx")) { Move-Item (Join-Path $appDir "context\PaymentContext.tsx") (Join-Path $modulesDir "payments\context") -Force }

# Products
if (Test-Path (Join-Path $appDir "components\products\*")) { Move-Item (Join-Path $appDir "components\products\*") (Join-Path $modulesDir "products\components") -Force }
if (Test-Path (Join-Path $appDir "pages\ProductManagement.tsx")) { Move-Item (Join-Path $appDir "pages\ProductManagement.tsx") (Join-Path $modulesDir "products\pages") -Force }
if (Test-Path (Join-Path $appDir "context\ProductContext.tsx")) { Move-Item (Join-Path $appDir "context\ProductContext.tsx") (Join-Path $modulesDir "products\context") -Force }

# Retailer
if (Test-Path (Join-Path $appDir "components\retailer\*")) { Move-Item (Join-Path $appDir "components\retailer\*") (Join-Path $modulesDir "retailer\components") -Force }
if (Test-Path (Join-Path $appDir "pages\RetailerManagement.tsx")) { Move-Item (Join-Path $appDir "pages\RetailerManagement.tsx") (Join-Path $modulesDir "retailer\pages") -Force }
if (Test-Path (Join-Path $appDir "pages\DashboardHome.tsx")) { Move-Item (Join-Path $appDir "pages\DashboardHome.tsx") (Join-Path $modulesDir "retailer\pages") -Force }

# Shipment
if (Test-Path (Join-Path $appDir "components\shipments\*")) { Move-Item (Join-Path $appDir "components\shipments\*") (Join-Path $modulesDir "shipment\components") -Force }
if (Test-Path (Join-Path $appDir "pages\ShipmentManagement.tsx")) { Move-Item (Join-Path $appDir "pages\ShipmentManagement.tsx") (Join-Path $modulesDir "shipment\pages") -Force }
if (Test-Path (Join-Path $appDir "context\ShipmentContext.tsx")) { Move-Item (Join-Path $appDir "context\ShipmentContext.tsx") (Join-Path $modulesDir "shipment\context") -Force }

# Storefront
if (Test-Path (Join-Path $appDir "components\storefront\*")) { Move-Item (Join-Path $appDir "components\storefront\*") (Join-Path $modulesDir "storefront\components") -Force }
if (Test-Path (Join-Path $appDir "pages\StorefrontManagement.tsx")) { Move-Item (Join-Path $appDir "pages\StorefrontManagement.tsx") (Join-Path $modulesDir "storefront\pages") -Force }

# Supply
if (Test-Path (Join-Path $appDir "components\supply\*")) { Move-Item (Join-Path $appDir "components\supply\*") (Join-Path $modulesDir "supply\components") -Force }
if (Test-Path (Join-Path $appDir "pages\SupplyManagement.tsx")) { Move-Item (Join-Path $appDir "pages\SupplyManagement.tsx") (Join-Path $modulesDir "supply\pages") -Force }
if (Test-Path (Join-Path $appDir "context\SupplierContext.tsx")) { Move-Item (Join-Path $appDir "context\SupplierContext.tsx") (Join-Path $modulesDir "supply\context") -Force }

# Optional: Figma components. Put in core/figma maybe? Or remove/leave
if (Test-Path (Join-Path $appDir "components\figma")) { Move-Item (Join-Path $appDir "components\figma") (Join-Path $coreDir "components") -Force }

# Clean up empty directories
Remove-Item (Join-Path $appDir "components\consignment") -Force -Recurse -ErrorAction SilentlyContinue
Remove-Item (Join-Path $appDir "components\credit") -Force -Recurse -ErrorAction SilentlyContinue
Remove-Item (Join-Path $appDir "components\dealers") -Force -Recurse -ErrorAction SilentlyContinue
Remove-Item (Join-Path $appDir "components\delivery") -Force -Recurse -ErrorAction SilentlyContinue
Remove-Item (Join-Path $appDir "components\orders") -Force -Recurse -ErrorAction SilentlyContinue
Remove-Item (Join-Path $appDir "components\payments") -Force -Recurse -ErrorAction SilentlyContinue
Remove-Item (Join-Path $appDir "components\products") -Force -Recurse -ErrorAction SilentlyContinue
Remove-Item (Join-Path $appDir "components\retailer") -Force -Recurse -ErrorAction SilentlyContinue
Remove-Item (Join-Path $appDir "components\shipments") -Force -Recurse -ErrorAction SilentlyContinue
Remove-Item (Join-Path $appDir "components\storefront") -Force -Recurse -ErrorAction SilentlyContinue
Remove-Item (Join-Path $appDir "components\supply") -Force -Recurse -ErrorAction SilentlyContinue

Remove-Item (Join-Path $appDir "components") -Force -Recurse -ErrorAction SilentlyContinue
Remove-Item (Join-Path $appDir "context") -Force -Recurse -ErrorAction SilentlyContinue
Remove-Item (Join-Path $appDir "pages") -Force -Recurse -ErrorAction SilentlyContinue
Remove-Item (Join-Path $appDir "data") -Force -Recurse -ErrorAction SilentlyContinue

Write-Host "Restructuring Complete."
