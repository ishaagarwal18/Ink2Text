"""
Database Setup Script for Ink2Text
This script creates the PostgreSQL database and tables
"""

import psycopg2
from psycopg2 import sql
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

# Database configuration
DB_NAME = "ink2text_db"
DB_USER = "postgres"
DB_PASSWORD = "123"
DB_HOST = "localhost"
DB_PORT = "5432"

def create_database():
    """Create the ink2text_db database if it doesn't exist"""
    try:
        # Connect to PostgreSQL server (default postgres database)
        conn = psycopg2.connect(
            dbname="postgres",
            user=DB_USER,
            password=DB_PASSWORD,
            host=DB_HOST,
            port=DB_PORT
        )
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = conn.cursor()

        # Check if database exists
        cursor.execute(
            "SELECT 1 FROM pg_database WHERE datname = %s",
            (DB_NAME,)
        )
        exists = cursor.fetchone()

        if not exists:
            # Create database
            cursor.execute(
                sql.SQL("CREATE DATABASE {}").format(
                    sql.Identifier(DB_NAME)
                )
            )
            print(f"✅ Database '{DB_NAME}' created successfully!")
        else:
            print(f"ℹ️  Database '{DB_NAME}' already exists")

        cursor.close()
        conn.close()
        return True

    except psycopg2.Error as e:
        print(f"❌ Error creating database: {e}")
        return False

def test_connection():
    """Test connection to the ink2text_db database"""
    try:
        conn = psycopg2.connect(
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD,
            host=DB_HOST,
            port=DB_PORT
        )
        print(f"✅ Successfully connected to '{DB_NAME}' database!")
        conn.close()
        return True
    except psycopg2.Error as e:
        print(f"❌ Error connecting to database: {e}")
        return False

if __name__ == "__main__":
    print("\n" + "="*60)
    print("🗄️  Ink2Text Database Setup")
    print("="*60)
    
    print("\n📋 Configuration:")
    print(f"   Database: {DB_NAME}")
    print(f"   User: {DB_USER}")
    print(f"   Host: {DB_HOST}")
    print(f"   Port: {DB_PORT}")
    
    print("\n🔧 Creating database...")
    if create_database():
        print("\n🔌 Testing connection...")
        if test_connection():
            print("\n✅ Database setup complete!")
            print("\n📝 Next steps:")
            print("   1. Run: python app.py")
            print("   2. Tables will be created automatically")
        else:
            print("\n❌ Setup failed - connection test failed")
    else:
        print("\n❌ Setup failed - could not create database")
    
    print("\n" + "="*60 + "\n")
