class ApplicationController < ActionController::API
    include ActionController::MimeResponds

    def encode(payload)
        JWT.encode(payload, ENV.fetch('JWT_SECRET', 'test'))
    end

    def auth_header
        request.headers['Authorization']
    end

    def decode_token
        if auth_header
            token = auth_header.split(' ')[1]
            begin
                JWT.decode(token, ENV.fetch('JWT_SECRET', 'test'), true, algorithm: 'HS256')
            rescue JWT::DecodeError
                nil
            end
        end
    end

    def logged_in_user
        if decode_token
            @id = decode_token[0]['sub']
            @user = User.find_by(id: @id)
        end
    end

    def logged_in?
        !!logged_in_user
    end

    def authorized
        if logged_in?
            @user = logged_in_user
            return @user.id
        else
            nil
        end
    end
end
