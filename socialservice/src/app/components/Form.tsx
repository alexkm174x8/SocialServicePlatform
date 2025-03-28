import React, { useState } from 'react';
import FormInput from './FormInput';

export default function Form() {
  return (
    <div className="flex flex-col items-center w-full h-full">
    
      <div className="w-full pb-4">
        {/* Primera Pregunta */}
        <div className="mb-4 flex flex-col items-center w-full">
          <div className="w-4/5">
            <h2 className="text-xl  text-left">
              ¿Qué te apasiona?
            </h2>
            <FormInput
              placeholder='Escribe tu respuesta aquí...' 
              className='w-full'
              fieldName='pasion'
              //validationRegex={/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/}
              errorMessage='Solo se permiten letras y espacios, y un máximo de 5 palabras'
            />
          </div>
        </div>
        {/* Segunda Pregunta */}
        <div className="mb-4 flex flex-col items-center w-full">
          <div className="w-4/5">
            <h2 className="text-xl  text-left">
              ¿En qué destacas?
            </h2>
            <FormInput 
              placeholder='Escribe tu respuesta aquí...' 
              className='w-full'
              fieldName='destaca'
              //validationRegex={/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/}
              errorMessage='Solo se permiten letras y espacios, y un máximo de 5 palabras'
            />
          </div>
        </div>
        {/* Tercera Pregunta */}
        <div className="mb-4 flex flex-col items-center w-full">
          <div className="w-4/5">
            <h2 className="text-xl  text-left">
              ¿Cuál es tu talento?
            </h2>
            <FormInput 
              placeholder='Escribe tu respuesta aquí...' 
              className='w-full'
              fieldName='talento'
              //validationRegex={/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/}
              errorMessage='Solo se permiten letras y espacios, y un máximo de 5 palabras'
            />
          </div>
        </div>
        {/* Cuarta Pregunta */}
        <div className="mb-4 flex flex-col items-center w-full">
          <div className="w-4/5">
            <h2 className="text-xl text-left">
              ¿Cuál es tu meta inmediata?
            </h2>
            <FormInput 
              placeholder='Escribe tu respuesta aquí...' 
              className='w-full'
              fieldName='meta'
              //validationRegex={/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/}
              errorMessage='Solo se permiten letras y espacios, y un máximo de 5 palabras'
            />
          </div>
        </div>
      </div>
    </div>
  );
}