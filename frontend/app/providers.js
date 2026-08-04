'use client';

import React, { useState, createContext, useContext } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import StudentRegisterModal from './components/StudentRegisterModal';
import StudentLoginModal from './components/StudentLoginModal';
import StudentDashboardModal from './components/StudentDashboardModal';

const ModalContext = createContext();
export const useModal = () => useContext(ModalContext);

export default function ClientLayoutWrapper({ children }) {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [activeStudent, setActiveStudent] = useState(null);

  const handleOpenRegister = () => setIsRegisterOpen(true);
  const handleOpenLogin = () => setIsLoginOpen(true);

  return (
    <ModalContext.Provider value={{ handleOpenRegister, handleOpenLogin }}>
      <Navbar
        onOpenStudentModal={handleOpenRegister}
        onOpenLoginModal={handleOpenLogin}
      />

      <main>
        {React.isValidElement(children)
          ? React.cloneElement(children, { onOpenStudentModal: handleOpenRegister })
          : children}
      </main>

      <Footer />

      {/* FLOATING WHATSAPP BUTTON */}
      <WhatsAppButton />

      {/* GLOBAL MODALS */}
      <StudentRegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
      />

      <StudentLoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={(student) => setActiveStudent(student)}
      />

      <StudentDashboardModal
        isOpen={!!activeStudent}
        studentData={activeStudent}
        onClose={() => setActiveStudent(null)}
      />
    </ModalContext.Provider>
  );
}