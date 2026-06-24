"use client";

import * as React from "react";
import Link from "next/link";
import { Search, Plus, UserCircle, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClienteForm } from "@/components/admin/cliente-form";
import type { Cliente } from "@/lib/types/database";
import { calcularEdad, calcularIMC, categoriaIMC } from "@/lib/utils/nutricional";

const objetivoLabel: Record<string, string> = {
  perdida_peso: "Pérdida de peso",
  ganancia_muscular: "Ganancia muscular",
  mantenimiento: "Mantenimiento",
  medico: "Médico",
};

export function ClientesTable({ clientes }: { clientes: Cliente[] }) {
  const [search, setSearch] = React.useState("");
  const [formOpen, setFormOpen] = React.useState(false);

  const filtered = clientes.filter((c) =>
    c.nombre.toLowerCase().includes(search.toLowerCase()) ||
    (c.correo ?? "").toLowerCase().includes(search.toLowerCase()) ||
    (c.telefono ?? "").includes(search)
  );

  return (
    <>
      <Card>
        <CardHeader className="flex-row flex-wrap items-center justify-between gap-3 space-y-0">
          <CardTitle>Clientes ({clientes.length})</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-52 pl-9"
              />
            </div>
            <Button onClick={() => setFormOpen(true)} size="sm" className="cursor-pointer">
              <Plus className="size-4" />
              Nuevo cliente
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <UserCircle className="size-10 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">
                {search ? "Sin resultados para esa búsqueda." : "No hay clientes registrados."}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Edad</TableHead>
                  <TableHead>Objetivo</TableHead>
                  <TableHead>IMC</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead className="text-right">Perfil</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((c) => {
                  const edad = c.fecha_nacimiento ? calcularEdad(c.fecha_nacimiento) : null;
                  const imc = c.peso && c.talla ? calcularIMC(c.peso, c.talla) : null;
                  const catImc = imc ? categoriaIMC(imc) : null;
                  return (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">{c.nombre}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {edad !== null ? `${edad} años` : "—"}
                      </TableCell>
                      <TableCell>
                        {c.objetivo_nutricional ? (
                          <Badge variant="outline" className="text-xs">
                            {objetivoLabel[c.objetivo_nutricional] ?? c.objetivo_nutricional}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {imc ? (
                          <span className="text-sm">
                            {imc.toFixed(1)}{" "}
                            <span className="text-xs text-muted-foreground">({catImc})</span>
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {c.telefono ?? c.correo ?? "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          render={<Link href={`/admin/clientes/${c.id}`} />}
                          nativeButton={false}
                          size="icon"
                          variant="ghost"
                          className="size-8 cursor-pointer"
                          title="Ver perfil"
                        >
                          <ArrowRight className="size-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <ClienteForm open={formOpen} onClose={() => setFormOpen(false)} />
    </>
  );
}
