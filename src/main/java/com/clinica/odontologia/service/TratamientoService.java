package com.clinica.odontologia.service;

import com.clinica.odontologia.entity.Tratamiento;
import java.util.List;

public interface TratamientoService {
    List<Tratamiento> listarActivos();
    Tratamiento obtenerPorId(Long id);
}
