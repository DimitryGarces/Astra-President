from smartcard.System import readers
from smartcard.util import toHexString, toBytes

# Función para leer el UID de la tarjeta
def get_uid(connection):
    """Obtiene el UID de la tarjeta NFC."""
    try:
        # Comando APDU para obtener el UID (específico para ACR122U)
        GET_UID = [0xFF, 0xCA, 0x00, 0x00, 0x00]
        data, sw1, sw2 = connection.transmit(GET_UID)
        if (sw1, sw2) == (0x90, 0x00):
            print("UID:", toHexString(data))
            return data
        else:
            print("Error al obtener UID:", hex(sw1), hex(sw2))
            return None
    except Exception as e:
        print(f"Error durante la comunicación con la tarjeta: {e}")
        return None

# Función para leer un bloque de datos de una tarjeta MIFARE Classic
def read_mifare_classic_block(connection, block_number, key_a=None):
    """Lee un bloque específico de una tarjeta MIFARE Classic."""

    if key_a is None:
        # Clave A por defecto (para tarjetas nuevas): FF FF FF FF FF FF
        key_a = [0xFF] * 6

    try:
        # 1. Autenticar el bloque usando la clave A
        LOAD_KEY = [0xFF, 0x82, 0x00, 0x00, 0x06] + key_a  # Cargar la clave A en el lector
        data, sw1, sw2 = connection.transmit(LOAD_KEY)
        if (sw1, sw2) != (0x90, 0x00):
            print("Error al cargar la clave:", hex(sw1), hex(sw2))
            return None

        # 2. Autenticar el bloque
        AUTH_SECTOR = [0xFF, 0x86, 0x00, 0x00, 0x05, 0x01, 0x00, block_number, 0x60, 0x00] # 0x60 es la clave A, 0x61 es la clave B
        data, sw1, sw2 = connection.transmit(AUTH_SECTOR)
        if (sw1, sw2) != (0x90, 0x00):
            print("Error de autenticación:", hex(sw1), hex(sw2))
            return None

        # 3. Leer el bloque
        READ_BLOCK = [0xFF, 0xB0, 0x00, block_number, 0x10]  # Leer 16 bytes
        data, sw1, sw2 = connection.transmit(READ_BLOCK)
        if (sw1, sw2) == (0x90, 0x00):
            print(f"Datos del bloque {block_number}:", toHexString(data))
            return data
        else:
            print(f"Error al leer el bloque {block_number}:", hex(sw1), hex(sw2))
            return None

    except Exception as e:
        print(f"Error durante la comunicación con la tarjeta: {e}")
        return None

# Función principal
def main():
    """Función principal del programa."""
    try:
        # Obtener la lista de lectores disponibles
        reader_list = readers()
        if not reader_list:
            print("No se detectaron lectores.")
            return

        # Buscar el lector ACR122U
        acr122u_reader = None
        for reader in reader_list:
            if "ACR122U-A9" in str(reader):
                acr122u_reader = reader
                break

        if acr122u_reader is None:
            print("No se encontró el lector ACR122U.")
            return

        print("Usando lector:", acr122u_reader)

        # Establecer conexión con el lector
        connection = acr122u_reader.createConnection()
        connection.connect()

        # Obtener el UID de la tarjeta
        uid = get_uid(connection)

        # Ejemplo de lectura de un bloque en una tarjeta MIFARE Classic
        if uid:
            # Leer el bloque 4 (puedes cambiarlo)
            block_data = read_mifare_classic_block(connection, 4)

    except Exception as e:
        print(f"Error: {e}")

# Ejecutar el programa
if __name__ == "__main__":
    main()