class ApplicationController < ActionController::API
  # 1. Por defecto, nadie pasa sin token
  before_action :authenticate_request
  attr_reader :current_user

  private

  def authenticate_request
    # Buscamos el token en los Headers (Authorization: Bearer <TOKEN>)
    header = request.headers['Authorization']
    token = header.split(' ').last if header
    
    @decoded = JsonWebToken.decode(token)
    @current_user = User.find(@decoded[:user_id]) if @decoded

    # Si no hay usuario válido, lanzamos el error de No Autorizado
    unless @current_user
      render json: { errors: 'No autorizado. Por favor inicia sesión.' }, status: :unauthorized
    end
  rescue ActiveRecord::RecordNotFound, JWT::DecodeError
    render json: { errors: 'Token inválido o expirado' }, status: :unauthorized
  end

  def authorize_admin!
    unless current_user&.admin?
      render json: { error: "Acceso denegado. Se requiere rol de Administrador." }, status: :forbidden
    end
  end
end