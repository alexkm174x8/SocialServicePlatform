'use client';

import React, { useCallback, useState } from 'react';
import * as XLSX from 'xlsx';
import { v4 as uuidv4 } from 'uuid';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl!, supabaseKey!);

const generateSecurePassword = () => {
  const length = 12;
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
};

const validateFields = (fields: string[]) => {
  const requiredFields = ["id_proyecto", "perfil_aceptacion", "proyecto", "grupo", "clave", "email"];

  const normalizedFields = fields.map((field) => field.trim().toLowerCase());
  
        {/*
const REQUIRED_FIELDS = [
  "id_proyecto", "perfil_aceptacion", "proyecto", "grupo", "clave", "representante",
  "contacto", "cupos", "objetivo_ps", "num_pmt", "ods_ps", "actividades",
  "detalles_horario", "habilidades", "modalidad", "lugar_trabajo", "duracion",
  "horas", "tipo_inscripcion", "ruta_maps", "crn", "periodo_academico",
  "fecha_pue", "pregunta_1", "pregunta_2", "pregunta_3", "id_socioformador",
  "carreras"
];

const validateFields = (fields: string[]) => {
  const normalized = fields.map(f => f.trim().toLowerCase());
  return REQUIRED_FIELDS.every(field => normalized.includes(field));
};

interface UploaderButtonProps {
  onClose: () => void;
}

const UploaderButton: React.FC<UploaderButtonProps> = ({ onClose }) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    processFile(droppedFile);
  }, []);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    processFile(selectedFile);
  };

  const processFile = (uploadedFile: File | undefined) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!uploadedFile) return;

    const isCSV = uploadedFile.type === 'text/csv';
    const isXLSX = uploadedFile.name.endsWith('.xlsx');

    if (!isCSV && !isXLSX) {
      setErrorMessage("Por favor, selecciona un archivo CSV o XLSX válido.");
      return;
    }

    setFile(uploadedFile);
    setFileName(uploadedFile.name);
  };

  const handleImport = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!file) {
      setErrorMessage("Primero selecciona un archivo válido.");
      return;
    }

    setIsImporting(true);
    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const data = new Uint8Array(event.target!.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        if (jsonData.length === 0) {
          setErrorMessage("El archivo está vacío.");
          setIsImporting(false);
        */}

const requiredFields = [
  "estatus_ps",
  "perfil_aceptacion",
  "crn",
  "grupo",
  "clave",
  "periodo_academico",
  "pmt_nacional",
  "fecha_ejecucion_nal",
  "osf",
  "proyecto",
  "objetivo_ps",
  "ods_ps",
  "actividades",
  "horario",
  "detalles_horario",
  "habilidades",
  "modalidad",
  "lugar_trabajo",
  "duracion",
  "horas",
  "carreras",
  "fecha_pue",
  "modalidad_simple",
  "num_pmt",
  "imagen_ods",
  "img_maps",
  "tipo_inscripcion",
  "enlace_proceso",
  "video",
  "img_video",
  "ruta_maps",
  "img_btnproceso",
  "url_pue",
  "correo",
  "pregunta_1",
  "pregunta_2",
  "pregunta_3",
  "cupos"
] as const;

// Normaliza los nombres de campos eliminando acentos y convirtiendo a minúsculas
const normalize = (str: string) =>
  str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "_").toLowerCase();

type RequiredField = typeof requiredFields[number];

type RecordType = {
  [K in RequiredField]?: string | number | null;
};

const validateFields = (fields: string[]): boolean => {
  const normalizedFields = fields.map((field: string) => field.trim().toLowerCase());

  console.log("Campos detectados (normalizados):", normalizedFields);
  console.log("Campos requeridos:", requiredFields);
  return requiredFields.every((field) => normalizedFields.includes(field.toLowerCase()));
};


const filterRequiredFields = (data: any[]) => {
  const requiredFields = ["id_proyecto", "perfil_aceptacion", "proyecto", "grupo", "clave", "email"];
  return data.map((record) => {
    const filteredRecord: Record<string, any> = {};
    requiredFields.forEach((field) => {
      // Busca el campo en el registro, normalizando los nombres
      const key = Object.keys(record).find(k => normalize(k) === field);
      filteredRecord[field] = key ? record[key] : null;
    });
    return filteredRecord;
  });
};

const generateProjectEmail = (proyecto: string, id_proyecto: string) => {
  // Remove special characters and spaces from project name
  const cleanProyecto = proyecto
    .toLowerCase()
    .replace(/[áäàâã]/g, 'a')
    .replace(/[éëèê]/g, 'e')
    .replace(/[íïìî]/g, 'i')
    .replace(/[óöòôõ]/g, 'o')
    .replace(/[úüùû]/g, 'u')
    .replace(/ñ/g, 'n')
    .replace(/[^a-z0-9]/g, '')
    .substring(0, 20); // Limit length to avoid too long emails

  // Create a unique identifier using the first 6 characters of the project ID
  const projectId = id_proyecto.substring(0, 6).toLowerCase();
  
  // Use a fixed domain for all project emails
  return `${cleanProyecto}.${projectId}@serviciosocial.com`;
};

const sendWelcomeEmail = async (originalEmail: string, projectEmail: string, password: string, proyecto: string) => {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        originalEmail,
        projectEmail,
        password,
        proyecto,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Error sending email');
    }

    return data;
  } catch (error) {
    console.error('Error in sendWelcomeEmail:', error);
    throw error;
  }
};
const handleFileUpload = async (file: File) => {
  const reader = new FileReader();

  reader.onload = async (event: ProgressEvent<FileReader>) => {
    if (!event.target?.result) {
      alert("Error al leer el archivo.");
      return;
    }

    const data = new Uint8Array(event.target.result as ArrayBuffer);
    const workbook = XLSX.read(data, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(sheet);

    if (!Array.isArray(jsonData) || jsonData.length === 0) {
      alert("El archivo está vacío.");
      return;
    }

    const fields = Object.keys(jsonData[0] as object);
    console.log("Campos detectados en el archivo:", fields);
    const normalizedFields = fields.map((field: string) => normalize(field));
    const missingFields = requiredFields.filter((field) => !normalizedFields.includes(field));
    if (missingFields.length > 0) {
      alert(`El archivo no contiene todos los campos requeridos. Faltan: ${missingFields.join(", ")}`);
      return;
    }

    const filteredData = jsonData.map((row: any) => {
      const { id_proyecto, perfil_aceptacion, proyecto, grupo, clave, email } = row;
      return { id_proyecto, perfil_aceptacion, proyecto, grupo, clave, email };
    });


    try {
      const createdUsers: { 
        originalEmail: string;
        projectEmail: string;
        password: string;
        proyecto: string;
        id_proyecto: string;
      }[] = [];
      const emailErrors: { email: string; error: string }[] = [];

      for (const record of filteredData) {
        // Generate project-specific email with fixed domain
        const projectEmail = generateProjectEmail(record.proyecto, record.id_proyecto);

        // First check if project exists
        const { data: existingRecord, error: fetchError } = await supabase
          .from('proyectos_solidarios')
          .select('id_proyecto, project_email')
          .eq('id_proyecto', record.id_proyecto)
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
          console.error("Error al verificar existencia del registro:", fetchError);
          emailErrors.push({ email: record.email, error: fetchError.message });
          continue;
        }

        if (existingRecord) {
          console.log("El registro con id_proyecto ${record.id_proyecto} ya existe. Se omitirá.");
          continue;
        }

        // Check if the project email is already in use by trying to sign in
        const { data: existingUser, error: userCheckError } = await supabase.auth.signInWithPassword({
          email: projectEmail,
          password: 'dummy-password-for-check'
        });

        // If we get a "Invalid login credentials" error, it means the email exists
        if (userCheckError && userCheckError.message !== 'Invalid login credentials') {
          console.error("Error al verificar email del proyecto:", userCheckError);
          emailErrors.push({ email: record.email, error: userCheckError.message });
          continue;
        }

        if (existingUser?.user) {
          console.error("El email de proyecto ${projectEmail} ya está en uso.");
          emailErrors.push({ email: record.email, error: 'Email de proyecto ya en uso' });
          continue;
        }

        // Generate a secure password for the user
        const password = generateSecurePassword();

        // Create the user in Supabase Auth with the project-specific email
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: projectEmail,
          password: password,
          email_confirm: true,
          user_metadata: {
            original_email: record.email, // Store the original email in user metadata
            proyecto: record.proyecto,
            id_proyecto: record.id_proyecto
          }
        });

        if (authError) {
          console.error("Error al crear el usuario:", authError);
          emailErrors.push({ email: record.email, error: authError.message });
          continue;
        }

        // Store the user credentials for later display
        createdUsers.push({
          originalEmail: record.email,
          projectEmail: projectEmail,
          password: password,
          proyecto: record.proyecto,
          id_proyecto: record.id_proyecto
        });

        // Insert the project record with both emails
        const { error: insertError } = await supabase
          .from('proyectos_solidarios')
          .insert({
            ...record,
            project_email: projectEmail, // Store the project-specific email
            email: record.email // Keep the original email
          });

        if (insertError) {
          console.error("Error al insertar el registro:", insertError);
          emailErrors.push({ email: record.email, error: insertError.message });
          continue;
        }

        // Send welcome email to the original email address
        try {
          await sendWelcomeEmail(record.email, projectEmail, password, record.proyecto);
        } catch (emailError) {
          console.error("Error sending email to ${record.email}:, emailError");
          emailErrors.push({ email: record.email, error: 'Error sending welcome email' });
        }
      }

      // After all operations are complete, show the results
      let message = "Proceso completado.\n\n";
      
      if (createdUsers.length > 0) {
        message += `Se crearon ${createdUsers.length} usuarios exitosamente.\n`;
        message += "Se han enviado los correos con las credenciales a los usuarios.\n\n";
        message += "Detalles de las cuentas creadas:\n";
        createdUsers.forEach(user => {
          message += `\nProyecto: ${user.proyecto}\n`;
          message += `Email original: ${user.originalEmail}\n`;
          message += `Email de acceso: ${user.projectEmail}\n`;
        });
      }
      
      if (emailErrors.length > 0) {
        message += "\nHubo ${emailErrors.length} errores:\n";
        emailErrors.forEach(({ email, error }) => {
          message += `- ${email}: ${error}\n`;
        });
      }

      alert(message);
    } catch (err) {
      console.error("Error al procesar el archivo:", err);
      alert("Hubo un error al procesar el archivo.");
    }
  };
        if (!isValid) {
          setErrorMessage("El archivo no contiene todos los campos requeridos.");
          setFile(null); 
          setFileName(null);
          setIsImporting(false);
          return;
        }

        for (const record of jsonData) {
          const { data: existing, error: fetchError } = await supabase
            .from('proyectos_solidarios')
            .select('id_proyecto')
            .eq('id_proyecto', record['id_proyecto'])
            .single();

          if (fetchError && fetchError.code !== 'PGRST116') {
            setErrorMessage("Error al verificar duplicados.");
            setIsImporting(false);
            return;
          }

          if (existing) {
            console.log(`Registro duplicado: ${record['id_proyecto']}`);
            continue;
          }

          const { error: insertError } = await supabase
            .from('proyectos_solidarios')
            .insert(record);

          if (insertError) {
            setErrorMessage(`Error al insertar el registro ${record['id_proyecto']}`);
            setIsImporting(false);
            return;
          }
        }

        setSuccessMessage("Archivo importado exitosamente.");
        resetUploader();
      } catch (err) {
        setErrorMessage("Ocurrió un error al procesar el archivo.");
        console.error(err);
      } finally {
        setIsImporting(false);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const resetUploader = () => {
    setFile(null);
    setFileName(null);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  return (
    <div className="w-full max-w-sm h-auto  rounded-2xl text-center flex flex-col items-center justify-center"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <div className="border-2 border-dashed border-blue-900 w-full flex flex-col items-center justify-center space-y-4 hover:bg-blue-50 p-4 rounded-xl">
        <img src="/upload.svg" alt="upload" className="h-8 w-8 text-blue-900" />
        <p className="text-xl font-semibold mb-4 text-blue-900">Arrastra y suelta para subir</p>
        <p className="text-sm text-gray-600">
          También puedes{' '}
          <label htmlFor="file-upload" className="text-blue-600 font-semibold cursor-pointer">
            buscar
          </label>{' '}
          en tu explorador
        </p>
        <p className="text-[11px] text-gray-600">Se aceptan subir archivos .CSV o .XLSX</p>
        <input
          id="file-upload"
          type="file"
          accept=".csv,.xlsx"
          className="hidden"
          onChange={handleFileChange}
        />
        {fileName && <p className="text-sm text-green-700 truncate">{fileName}</p>}
      </div>
      <div className= "pt-3">
      {errorMessage && <div className="text-red-600 text-sm font-medium">{errorMessage}</div>}
      {successMessage && <div className="text-green-600 text-sm font-medium">{successMessage}</div>}
      </div>
  
      <div className="flex gap-4 mt-4">
        <button
          onClick={() => {
            resetUploader();
            onClose();
          }}
          className="border border-blue-900 rounded-full px-6 py-2 text-sm font-semibold text-blue-900 hover:bg-transparent transition duration-200"
        >
          Cancelar
        </button>
  
        <button
          onClick={handleImport}
          disabled={!file || isImporting}
          className={`rounded-full px-6 py-2 text-sm font-semibold transition duration-200
            ${file ? 'bg-blue-900 text-white hover:bg-[#3154bb]' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
        >
          {isImporting ? 'Importando...' : 'Importar'}
        </button>
      </div>
    </div>
  );
};  


export default UploaderButton;
