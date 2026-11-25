package com.clinica.odontologia.service.impl;

import com.clinica.odontologia.entity.Tratamiento;
import com.clinica.odontologia.repository.TratamientoRepository;
import com.clinica.odontologia.service.TratamientoService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class TratamientoServiceImpl implements TratamientoService {

    private final TratamientoRepository tratamientoRepository;

    public TratamientoServiceImpl(TratamientoRepository tratamientoRepository) {
        this.tratamientoRepository = tratamientoRepository;
    }

    @Override
    public List<Tratamiento> listarActivos() {
        return tratamientoRepository.findByActivoTrue();
    }

    @Override
    public Tratamiento obtenerPorId(Long id) {
        return tratamientoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Tratamiento no encontrado con ID: " + id));
    }
}
