/**
 * Servicio para gestionar usuarios
 * Solo accesible para administradores
 */

import { supabase } from '../supabase/index.js';
import { SUPABASE_CONFIG } from '../supabase/config.js';

const USE_SUPABASE = !!(SUPABASE_CONFIG.url && SUPABASE_CONFIG.anonKey && SUPABASE_CONFIG.url !== '');

class UserService {
  /**
   * Crear un nuevo usuario (solo administradores)
   * @param {Object} userData - Datos del usuario
   * @param {string} userData.email - Email del usuario
   * @param {string} userData.password - Contraseña
   * @param {string} userData.username - Nombre de usuario
   * @param {string} userData.nombre - Nombre completo
   * @param {string} userData.rol - Rol del usuario ('admin', 'vendedor', 'usuario')
   * @returns {Promise<Object>} Usuario creado
   */
  async createUser(userData) {
    if (!USE_SUPABASE) {
      throw new Error('El servicio de usuarios requiere Supabase');
    }

    try {
      // Validar datos
      if (!userData.email || !userData.email.includes('@')) {
        throw new Error('El correo electrónico es requerido y debe ser válido');
      }

      if (!userData.password || userData.password.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
      }

      if (!userData.rol || !['admin', 'vendedor', 'usuario'].includes(userData.rol)) {
        throw new Error('El rol debe ser: admin, vendedor o usuario');
      }

      // Crear usuario en Supabase Auth usando signUp
      // El trigger automáticamente creará el registro en la tabla users
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: userData.email.trim().toLowerCase(),
        password: userData.password,
        options: {
          data: {
            nombre: userData.nombre || userData.username || userData.email.split('@')[0],
            username: userData.username || userData.email.split('@')[0],
            rol: userData.rol
          },
          email_redirect_to: undefined
        }
      });

      if (signUpError) {
        // Manejar errores específicos
        if (signUpError.message.includes('User already registered')) {
          throw new Error('Ya existe un usuario con este correo electrónico');
        }
        throw new Error(`Error al crear usuario: ${signUpError.message}`);
      }

      if (!signUpData.user) {
        throw new Error('No se pudo crear el usuario. Verifica la configuración de Supabase.');
      }

      const userId = signUpData.user.id;

      // Esperar un momento para que el trigger cree el registro en la tabla users
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Verificar si el usuario fue creado en la tabla users por el trigger
      let userRecord = null;
      let attempts = 0;
      const maxAttempts = 5;

      while (!userRecord && attempts < maxAttempts) {
        const { data: existingUser, error: fetchError } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single();

        if (existingUser && !fetchError) {
          userRecord = existingUser;
          break;
        }

        attempts++;
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Si el trigger no creó el usuario, crearlo manualmente
      if (!userRecord) {
        const { data: newUserRecord, error: insertError } = await supabase
          .from('users')
          .insert([
            {
              id: userId,
              username: userData.username || userData.email.split('@')[0],
              email: userData.email.trim().toLowerCase(),
              nombre: userData.nombre || userData.username || userData.email.split('@')[0],
              rol: userData.rol
            }
          ])
          .select()
          .single();

        if (insertError) {
          // Si ya existe (el trigger lo creó), obtenerlo
          if (insertError.code === '23505') { // Unique violation
            const { data: existingUser } = await supabase
              .from('users')
              .select('*')
              .eq('id', userId)
              .single();
            
            if (existingUser) {
              userRecord = existingUser;
            } else {
              throw new Error(`Error al crear usuario en la tabla: ${insertError.message}`);
            }
          } else {
            throw new Error(`Error al crear usuario en la tabla: ${insertError.message}`);
          }
        } else {
          userRecord = newUserRecord;
        }
      }

      // Actualizar el rol del usuario (el trigger puede haberlo creado con rol por defecto)
      if (userRecord.rol !== userData.rol) {
        const { data: updatedUser, error: updateError } = await supabase
          .from('users')
          .update({ rol: userData.rol })
          .eq('id', userId)
          .select()
          .single();

        if (updateError) {
          console.warn('No se pudo actualizar el rol del usuario:', updateError);
          // Continuar de todas formas, el usuario está creado
        } else {
          userRecord = updatedUser;
        }
      }

      // Confirmar el email del usuario automáticamente usando una función SQL
      // Nota: Esto requiere permisos de administrador en Supabase
      // Por ahora, el usuario necesitará confirmar su email manualmente
      // O podemos crear una función Edge Function para esto

      return userRecord;
    } catch (error) {
      console.error('Error en createUser:', error);
      throw error;
    }
  }

  /**
   * Obtener todos los usuarios (solo administradores)
   * @returns {Promise<Array>} Lista de usuarios
   */
  async getAllUsers() {
    if (!USE_SUPABASE) {
      throw new Error('El servicio de usuarios requiere Supabase');
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Error al obtener usuarios: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error en getAllUsers:', error);
      throw error;
    }
  }

  /**
   * Obtener un usuario por ID
   * @param {string} userId - ID del usuario
   * @returns {Promise<Object>} Usuario
   */
  async getUserById(userId) {
    if (!USE_SUPABASE) {
      throw new Error('El servicio de usuarios requiere Supabase');
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        throw new Error(`Error al obtener usuario: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error en getUserById:', error);
      throw error;
    }
  }

  /**
   * Actualizar un usuario (solo administradores)
   * @param {string} userId - ID del usuario
   * @param {Object} userData - Datos a actualizar
   * @returns {Promise<Object>} Usuario actualizado
   */
  async updateUser(userId, userData) {
    if (!USE_SUPABASE) {
      throw new Error('El servicio de usuarios requiere Supabase');
    }

    try {
      // Validar rol si se está actualizando
      if (userData.rol && !['admin', 'vendedor', 'usuario'].includes(userData.rol)) {
        throw new Error('El rol debe ser: admin, vendedor o usuario');
      }

      const updateData = {};
      
      if (userData.username) updateData.username = userData.username;
      if (userData.nombre) updateData.nombre = userData.nombre;
      if (userData.rol) updateData.rol = userData.rol;
      if (userData.email) updateData.email = userData.email.trim().toLowerCase();

      const { data, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        throw new Error(`Error al actualizar usuario: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error en updateUser:', error);
      throw error;
    }
  }

  /**
   * Eliminar un usuario (solo administradores)
   * @param {string} userId - ID del usuario
   * @returns {Promise<void>}
   */
  async deleteUser(userId) {
    if (!USE_SUPABASE) {
      throw new Error('El servicio de usuarios requiere Supabase');
    }

    try {
      // Eliminar de la tabla users
      // Nota: El CASCADE en la tabla users eliminará automáticamente el usuario de auth.users
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) {
        throw new Error(`Error al eliminar usuario: ${error.message}`);
      }

      // Nota: Para eliminar completamente de auth.users, necesitaríamos permisos de administrador
      // o una función Edge Function. Por ahora, el CASCADE debería manejarlo.
    } catch (error) {
      console.error('Error en deleteUser:', error);
      throw error;
    }
  }

  /**
   * Actualizar contraseña de un usuario (solo administradores)
   * Nota: Esta funcionalidad requiere permisos de administrador en Supabase
   * Para producción, se recomienda crear una Edge Function
   * @param {string} userId - ID del usuario
   * @param {string} newPassword - Nueva contraseña
   * @returns {Promise<void>}
   */
  async updateUserPassword(userId, newPassword) {
    if (!USE_SUPABASE) {
      throw new Error('El servicio de usuarios requiere Supabase');
    }

    try {
      if (!newPassword || newPassword.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
      }

      // Nota: Actualizar contraseña requiere permisos de administrador
      // Esto normalmente se hace a través de una Edge Function o usando el servicio de administración
      // Por ahora, lanzamos un error informativo
      throw new Error('La actualización de contraseña requiere permisos de administrador. Por favor, use el panel de Supabase o cree una Edge Function para esta funcionalidad.');
    } catch (error) {
      console.error('Error en updateUserPassword:', error);
      throw error;
    }
  }
}

export default new UserService();

