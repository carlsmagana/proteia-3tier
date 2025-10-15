#!/usr/bin/env python3
"""
Script para verificar usuarios en la base de datos
"""

import pyodbc
from connection_config import get_direct_connection_string

def check_users():
    print("🔍 Verificando usuarios en la base de datos...")
    
    username = input("Usuario SQL: ").strip()
    password = input("Contraseña: ").strip()
    
    try:
        conn_str = get_direct_connection_string(username, password)
        
        with pyodbc.connect(conn_str) as conn:
            cursor = conn.cursor()
            
            # Verificar usuarios en config.users
            print("\n👥 Usuarios en config.users:")
            cursor.execute("""
                SELECT 
                    IdUser,
                    NameUser,
                    Email,
                    Password,
                    LEN(Password) as PasswordLength
                FROM config.users
                ORDER BY IdUser
            """)
            
            users = cursor.fetchall()
            
            if users:
                print(f"{'ID':<5} {'Nombre':<20} {'Email':<30} {'Password':<15} {'Len':<5}")
                print("-" * 80)
                
                for user in users:
                    # Mostrar solo los primeros 3 y últimos 3 caracteres de la password
                    pwd = user.Password or ""
                    if len(pwd) > 6:
                        masked_pwd = pwd[:3] + "*" * (len(pwd) - 6) + pwd[-3:]
                    else:
                        masked_pwd = "*" * len(pwd)
                    
                    print(f"{user.IdUser:<5} {user.NameUser or 'NULL':<20} {user.Email or 'NULL':<30} {masked_pwd:<15} {user.PasswordLength or 0:<5}")
            else:
                print("❌ No se encontraron usuarios")
            
            # Verificar si existe el usuario Proteia que creamos
            print(f"\n🔍 Verificando usuario Proteia específico:")
            cursor.execute("""
                SELECT IdUser, NameUser, Email, Password
                FROM config.users 
                WHERE Email LIKE '%proteia%' OR Email LIKE '%admin%' OR NameUser LIKE '%proteia%'
            """)
            
            proteia_users = cursor.fetchall()
            if proteia_users:
                for user in proteia_users:
                    print(f"   ID: {user.IdUser}")
                    print(f"   Nombre: {user.NameUser}")
                    print(f"   Email: {user.Email}")
                    print(f"   Password: {user.Password}")
            else:
                print("❌ No se encontró usuario Proteia")
            
            # Probar login directo
            print(f"\n🧪 Probando autenticación directa:")
            test_email = input("Email a probar: ").strip()
            test_password = input("Password a probar: ").strip()
            
            cursor.execute("""
                SELECT IdUser, NameUser, Email, Password
                FROM config.users 
                WHERE Email = ? AND Password = ?
            """, (test_email, test_password))
            
            auth_result = cursor.fetchone()
            if auth_result:
                print("✅ Autenticación exitosa!")
                print(f"   Usuario: {auth_result.NameUser}")
                print(f"   Email: {auth_result.Email}")
            else:
                print("❌ Autenticación fallida")
                
                # Verificar si existe el email
                cursor.execute("SELECT IdUser, Email, Password FROM config.users WHERE Email = ?", (test_email,))
                email_check = cursor.fetchone()
                if email_check:
                    print(f"   ✅ Email existe: {email_check.Email}")
                    print(f"   ❌ Password no coincide. BD tiene: '{email_check.Password}'")
                    print(f"   ❌ Intentaste: '{test_password}'")
                else:
                    print(f"   ❌ Email no existe: {test_email}")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    check_users()
