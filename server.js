require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs/promises');
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const app = express();

// Configurar CORS con opciones más robustas
app.use(cors({
    origin: ['http://127.0.0.1:5503', 'http://localhost:5503', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
    credentials: true,
    optionsSuccessStatus: 200
}));

// Middleware adicional para headers CORS
app.use((req, res, next) => {
    const allowedOrigins = ['http://127.0.0.1:5503', 'http://localhost:5503'];
    const origin = req.headers.origin;
    
    if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
    }
    
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, Origin, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    next();
});

app.use(express.json());
app.use('/Frontend', express.static(path.join(__dirname, 'Frontend')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Frontend', 'landing.html'));
});

app.get('/app', (req, res) => {
    res.sendFile(path.join(__dirname, 'Frontend', 'Html', 'index.html'));
});

// Configuración de Supabase
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const supabase = SUPABASE_URL && SUPABASE_KEY ? createClient(SUPABASE_URL, SUPABASE_KEY) : null;

const loadLocalProperties = async () => {
    const dataPath = path.join(__dirname, 'Frontend', 'data.json');
    const content = await fs.readFile(dataPath, 'utf8');
    return JSON.parse(content).map((property) => ({
        id: property.id,
        type: property.type || 'casa',
        title: property.title,
        description: property.description,
        price: property.price,
        area: property.area,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        features: property.amenities || [],
        amenities: property.amenities || [],
        coordinates: property.coordinates || [-116.82613528916899, 32.459822646108606],
        address: property.location,
        stars: property.stars || 5,
        imageUrl: Array.isArray(property.images) ? property.images[0] : property.imageUrl,
    }));
};

// Configuración de JWT
const generarToken = (usuario) => {
    return jwt.sign(
        { id: usuario.id, email: usuario.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
};

// Middleware para autenticación
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token inválido o expirado.' });
        }
        req.user = user;
        next();
    });
};

// SOLUCIÓN: ELIMINAR EL ENDPOINT DUPLICADO
// Solo mantener UN endpoint para update-role

// Endpoint para actualizar el rol del usuario
app.put('/api/users/update-role', authenticateToken, async (req, res) => {
    const { role } = req.body;
    const userId = req.user.id;

    try {
        // Actualizar el rol en la tabla `profiles`
        const { error } = await supabase
            .from('profiles')
            .update({ rol: role })
            .eq('id', userId);

        if (error) throw error;

        res.status(200).json({ message: 'Rol actualizado exitosamente.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar el rol.' });
    }
});

// Middleware de verificación de token (mantener si es necesario para otras rutas)
const verificarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token inválido o expirado.' });
        }
        req.usuario = user;
        next();
    });
};

// Endpoint de Registro
app.post('/api/registro', async (req, res) => {
    const { nombre_completo, email, contraseña } = req.body;

    try {
        // 1. Verificar si el email ya existe
        const { data: existeUsuario, error: errorExiste } = await supabase
            .from('usuarios')
            .select('*')
            .eq('email', email);

        if (errorExiste) throw errorExiste;

        if (existeUsuario.length > 0) {
            return res.status(400).json({ error: 'El email ya está registrado' });
        }

        // 2. Hashear la contraseña
        const salt = await bcrypt.genSalt(10);
        const contraseñaHash = await bcrypt.hash(contraseña, salt);

        // 3. Insertar nuevo usuario
        const { data: nuevoUsuario, error: errorInsert } = await supabase
            .from('usuarios')
            .insert([{ nombre_completo, email, contraseña_hash: contraseñaHash }])
            .select();

        if (errorInsert) throw errorInsert;

        // 4. Responder con éxito
        res.status(201).json({
            mensaje: 'Registro exitoso',
            usuario: {
                id: nuevoUsuario[0].id,
                email: nuevoUsuario[0].email,
                nombre: nuevoUsuario[0].nombre_completo
            }
        });

    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Endpoint de Login
app.post('/api/login', async (req, res) => {
    const { email, contraseña } = req.body;

    try {
        // Validar datos de entrada
        if (!email || !contraseña) {
            return res.status(400).json({ error: 'Faltan credenciales' });
        }

        // 1. Buscar usuario por email
        const { data: usuario, error: errorUsuario } = await supabase
            .from('usuarios')
            .select('id, nombre_completo, email, verificado, rol, contraseña_hash')
            .eq('email', email);

        if (errorUsuario) {
            console.error('Error al buscar usuario:', errorUsuario.message);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }

        if (usuario.length === 0) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // 2. Verificar contraseña
        const contraseñaValida = await bcrypt.compare(
            contraseña,
            usuario[0].contraseña_hash
        );

        if (!contraseñaValida) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // 3. Generar JWT
        const token = generarToken(usuario[0]);

        // Devolver respuesta sin contraseña_hash
        res.json({
            mensaje: 'Login exitoso',
            token,
            usuario: {
                id: usuario[0].id,
                nombre: usuario[0].nombre_completo,
                email: usuario[0].email,
                verificado: usuario[0].verificado,
                rol: usuario[0].rol
            }
        });

    } catch (error) {
        console.error('Error en login:', error.message);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Endpoint de Recuperación de Contraseña
app.post('/api/recuperar-contrasena', async (req, res) => {
    const { email } = req.body;

    try {
        // 1. Verificar si el email existe
        const { data: usuario, error: errorUsuario } = await supabase
            .from('usuarios')
            .select('*')
            .eq('email', email);

        if (errorUsuario) throw errorUsuario;

        if (usuario.length === 0) {
            return res.status(404).json({ error: 'Email no registrado' });
        }

        // 2. Generar token único con expiración
        const resetToken = crypto.randomBytes(20).toString('hex');
        const resetTokenExpira = new Date(Date.now() + 3600000); // 1 hora

        // 3. Actualizar usuario en la base de datos
        const { error: errorUpdate } = await supabase
            .from('usuarios')
            .update({ reset_token: resetToken, reset_token_expira: resetTokenExpira })
            .eq('id', usuario[0].id);

        if (errorUpdate) throw errorUpdate;

        // 4. Enviar email (simulado para desarrollo)
        console.log(`Enlace de recuperación: http://localhost:5500/reset-password?token=${resetToken}`);

        res.json({ mensaje: 'Se ha enviado un enlace de recuperación a tu email' });

    } catch (error) {
        console.error('Error en recuperación:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

app.post('/api/guardar-propiedad', async (req, res) => {
    try {
        const {
            owner_id,
            title,
            location,
            description,
            features,
            amenities,
            floorplan_url,
            rent_cost,
            rental_policies,
            photos,
        } = req.body;

        // Insertar la propiedad en la tabla properties
        const { data: propertyData, error: propertyError } = await supabase
            .from('properties')
            .insert([
                {
                    owner_id,
                    title,
                    location,
                    description,
                    features,
                    amenities,
                    floorplan_url,
                    rental_cost: rent_cost,
                    rental_policies,
                },
            ])
            .select();

        if (propertyError) {
            throw new Error(propertyError.message);
        }

        const propertyId = propertyData[0].id;

        // Insertar las fotos en la tabla property_photos
        for (const photo of photos) {
            await supabase.from('property_photos').insert([
                {
                    property_id: propertyId,
                    photo_url: photo,
                    is_main: false,
                },
            ]);
        }

        res.status(201).json({ message: 'Propiedad guardada exitosamente', propertyId });
    } catch (error) {
        console.error('Error al guardar la propiedad:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/subscribe', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'El correo electrónico es requerido' });
    }

    try {
        if (!supabase) {
            return res.status(200).json({ message: 'Correo registrado en modo demo' });
        }

        // Insertar el correo en la tabla `subscribers`
        const { error } = await supabase
            .from('subscribers')
            .insert([{ email }]);

        if (error) {
            throw error;
        }

        res.status(200).json({ message: 'Correo registrado con éxito' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const fetchPropertiesFromSupabase = async () => {
    try {
      if (!supabase) {
        return loadLocalProperties();
      }

      const { data, error } = await supabase
        .from('properties')
        .select('*');

      if (error) {
        throw new Error(`Error en la consulta: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error en fetchPropertiesFromSupabase:', error.message);
      return loadLocalProperties();
    }
};

// Endpoint para obtener todas las propiedades
app.get('/api/properties', async (req, res) => {
    try {
        const properties = await fetchPropertiesFromSupabase();
        res.status(200).json(properties);
    } catch (error) {
        console.error('Error al obtener las propiedades:', error.message);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Endpoint para guardar propiedades - CORREGIDO
app.post('/api/properties/fetch', async (req, res) => {
    // Headers CORS explícitos
    res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:5503');
    res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, Origin, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');

    try {
        const propertyData = req.body;

        console.log('Received property data:', propertyData);

        // Validar campos requeridos
        if (!propertyData.type || !propertyData.title || !propertyData.description || 
            !propertyData.price || !propertyData.features || !propertyData.coordinates) {
            return res.status(400).json({ 
                error: 'Faltan campos requeridos',
                required: ['type', 'title', 'description', 'price', 'features', 'coordinates']
            });
        }

        if (!supabase) {
            return res.status(201).json({
                message: 'Property stored in demo mode',
                property: { id: Date.now(), ...propertyData }
            });
        }

        // Insertar propiedad en Supabase - estructura corregida
        const { data, error } = await supabase
            .from('properties')
            .insert([{
                type: propertyData.type,
                title: propertyData.title,
                description: propertyData.description,
                price: propertyData.price,
                features: propertyData.features,
                amenities: propertyData.amenities || [],
                coordinates: propertyData.coordinates,
                address: propertyData.address || '',
                rental_policies: propertyData.rental_policies || '',
                stars: propertyData.stars || 0,
                owner_id: propertyData.owner_id || 1, // valor por defecto
                image_url: propertyData.imageUrl || null, // usar image_url en lugar de imageUrl
                floorplan: propertyData.floorplan || null,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }])
            .select();

        if (error) {
            console.error('Supabase error:', error);
            return res.status(400).json({ 
                error: 'Error de base de datos',
                details: error.message 
            });
        }

        console.log('Property stored successfully:', data);

        res.status(201).json({
            message: 'Property stored successfully',
            property: data[0]
        });

    } catch (error) {
        console.error('Error storing property:', error);
        res.status(500).json({ 
            error: 'Error al guardar la propiedad',
            details: error.message 
        });
    }
});

// Ruta específica para preflight requests
app.options('/api/properties/fetch', (req, res) => {
    res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:5503');
    res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, Origin, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.status(200).send();
});

// Middleware para manejar errores no capturados
app.use((error, req, res, next) => {
    console.error('Error no capturado:', error);
    res.status(500).json({ 
        error: 'Error interno del servidor',
        message: error.message 
    });
});

// Ruta de verificación de servidor
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Servidor funcionando correctamente' });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
