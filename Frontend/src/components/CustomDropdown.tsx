import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { theme } from "../styles/theme";
import { CustomDropdownProps } from "../types/Components";


export const CustomDropdown: React.FC<CustomDropdownProps> = ({
  label,
  options,
  selectedValue,
  onSelect,
  optional = false,
  placeholder,
}) => {
  const [visible, setVisible] = useState(false);

  const handleSelect = (value: string) => {
    onSelect(value);
    setVisible(false);
  };

  const getDisplayValue = () => {
    if (selectedValue) {
      const option = options.find(opt => opt.value === selectedValue);
      return option ? option.label : selectedValue;
    }
    return placeholder || `Selecionar ${label.toLowerCase()}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label} {!optional && "*"}
      </Text>
      <Pressable
        style={[styles.button, selectedValue && styles.buttonSelected]}
        onPress={() => setVisible(true)}
      >
        <Text style={[
          styles.buttonText, 
          !selectedValue && styles.placeholderText
        ]}>
          {getDisplayValue()}
        </Text>
        <Text style={styles.arrow}>▼</Text>
      </Pressable>

      <Modal visible={visible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecionar {label}</Text>
              <TouchableOpacity onPress={() => setVisible(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.option,
                    selectedValue === item.value && styles.selectedOption
                  ]}
                  onPress={() => handleSelect(item.value)}
                >
                  <Text style={[
                    styles.optionText,
                    selectedValue === item.value && styles.selectedOptionText
                  ]}>
                    {item.label}
                  </Text>
                  {selectedValue === item.value && (
                    <Text style={styles.checkMark}>✓</Text>
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: theme.gap.s,
    ...theme.size.full_width,
  },
  label: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: theme.typography.fontFamily.semibold,
    color: theme.colors.dark_text,
    marginBottom: theme.gap.xs,
  },
  button: {
    ...theme.flex.row,
    ...theme.align['space-between'],
    borderWidth: theme.borderColor.borderWidth,
    borderColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    ...theme.padding.horizontal.sm,
    ...theme.padding.vertical.sm,
    backgroundColor: theme.colors.white,
  },
  buttonSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.white,
  },
  buttonText: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.dark_text,
    flex: 1,
  },
  placeholderText: {
    color: theme.colors.gray,
    opacity: 0.7,
  },
  arrow: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.primary,
    marginLeft: theme.gap.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    ...theme.align.center,
    ...theme.padding.horizontal.l,
  },
  modalContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    ...theme.size.full_width,
    maxHeight: 400,
    overflow: 'hidden',
  },
  modalHeader: {
    ...theme.flex.row,
    ...theme.align['space-between'],
    ...theme.padding.horizontal.md,
    paddingVertical: theme.gap.md,
    borderBottomWidth: theme.borderColor.borderWidth,
    borderBottomColor: theme.colors.gray,
  },
  modalTitle: {
    fontSize: theme.typography.sizes.md,
    fontFamily: theme.typography.fontFamily.semibold,
    color: theme.colors.dark_text,
  },
  closeButton: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.dark_text,
    padding: theme.gap.xs,
  },
  option: {
    ...theme.flex.row,
    ...theme.align['space-between'],
    ...theme.padding.horizontal.md,
    paddingVertical: theme.gap.md,
    borderBottomWidth: 0.5,
    borderBottomColor: theme.colors.gray,
  },
  selectedOption: {
    backgroundColor: theme.colors.secondary,
  },
  optionText: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.dark_text,
  },
  selectedOptionText: {
    fontFamily: theme.typography.fontFamily.semibold,
    color: theme.colors.primary,
  },
  checkMark: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.primary,
    fontFamily: theme.typography.fontFamily.bold,
  },
});