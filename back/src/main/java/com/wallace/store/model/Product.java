package com.wallace.store.model;

import jakarta.persistence.*;
import lombok.*;

@Table(name = "tb_products")
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@EqualsAndHashCode
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String title;
    private double price;
    private String img;

}
