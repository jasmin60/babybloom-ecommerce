import sqlite3

def pump_legacy_records():
    # Establish direct pipe connection to your database file
    connection = sqlite3.connect('db.sqlite3')
    cursor = connection.cursor()
    
    print("🚀 Initializing data recovery stream...")
    
    try:
        # 1. Pump Categories table rows
        cursor.execute("SELECT id, name, slug FROM store_category;")
        categories = cursor.fetchall()
        for cat in categories:
            cursor.execute(
                "INSERT OR IGNORE INTO products_category (id, name, slug) VALUES (?, ?, ?);", 
                cat
            )
        print(f"✅ Categories structural layer synchronized ({len(categories)} rows processed).")

        # 2. Pump SubCategories table rows
        cursor.execute("SELECT id, name, slug, parent_category_id FROM store_subcategory;")
        subcategories = cursor.fetchall()
        for sub in subcategories:
            cursor.execute(
                "INSERT OR IGNORE INTO products_subcategory (id, name, slug, parent_category_id) VALUES (?, ?, ?, ?);", 
                sub
            )
        print(f"✅ SubCategories linkage layer synchronized ({len(subcategories)} rows processed).")

        # 3. Pump Master Products dataset metrics (137 records stream)
        cursor.execute("""
            SELECT id, gender_tag, name, price, description, image, image_thumb_back, 
                   image_zoom_detail, brand, color, age_group, stock_quantity, 
                   product_tags, active_offer_percentage, card_extra_discount_percentage, 
                   upi_cashback_reward, view_count, is_admin_approved, subcategory_id 
            FROM store_product;
        """)
        products = cursor.fetchall()
        
        for prod in products:
            cursor.execute("""
                INSERT OR IGNORE INTO products_product (
                    id, gender_tag, name, price, description, image, image_thumb_back, 
                    image_zoom_detail, brand, color, age_group, stock_quantity, 
                    product_tags, active_offer_percentage, card_extra_discount_percentage, 
                    upi_cashback_reward, view_count, is_admin_approved, subcategory_id
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
            """, prod)
        
        connection.commit()
        print(f"🎉 SUCCESS! All {len(products)} legacy products have been transferred to the modular architecture.")
        
    except sqlite3.OperationalError as e:
        print(f"❌ SQL Execution Error: {e}")
        print("Ensure you haven't deleted the 'store_' tables yet or verify structural layouts.")
    finally:
        connection.close()

if __name__ == "__main__":
    pump_legacy_records()